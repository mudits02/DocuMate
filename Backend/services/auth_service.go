package services

import (
	"context"
	"documate/config"
	"documate/models"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
)

// --- Google User Info struct ---
type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// --- Get Google Auth URL ---
func GetGoogleAuthURL(state string) string {
	return config.GoogleOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

// --- Exchange code for user info ---
func GetGoogleUserInfo(code string) (*GoogleUserInfo, error) {
	token, err := config.GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, errors.New("failed to exchange token: " + err.Error())
	}

	client := config.GoogleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, errors.New("failed to get user info: " + err.Error())
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var userInfo GoogleUserInfo
	json.Unmarshal(body, &userInfo)

	return &userInfo, nil
}

// --- Find or Create User from Google ---
func FindOrCreateGoogleUser(info *GoogleUserInfo) (*models.User, error) {
	var user models.User

	result := config.DB.Where("google_id = ?", info.ID).First(&user)
	if result.Error != nil {
		// User doesn't exist, create one
		user = models.User{
			Name:     info.Name,
			Email:    info.Email,
			GoogleID: info.ID,
			Provider: "google",
			Avatar:   info.Picture,
		}
		if err := config.DB.Create(&user).Error; err != nil {
			return nil, err
		}
	}

	return &user, nil
}

// --- Generate JWT Access Token ---
func GenerateAccessToken(userID uint) (string, error) {
	expiryHours, _ := strconv.Atoi(config.GetEnv("JWT_EXPIRY_HOURS"))
	if expiryHours == 0 {
		expiryHours = 15
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Duration(expiryHours) * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
}

// --- Generate Refresh Token ---
func GenerateRefreshToken(userID uint) (string, error) {
	expiryDays, _ := strconv.Atoi(config.GetEnv("REFRESH_TOKEN_EXPIRY_DAYS"))
	if expiryDays == 0 {
		expiryDays = 7
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Duration(expiryDays) * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
}

// --- Validate JWT Token ---
func ValidateToken(tokenStr string) (uint, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.GetEnv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return 0, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("invalid claims")
	}

	userID := uint(claims["user_id"].(float64))
	return userID, nil
}

// --- Get User by ID ---
func GetUserByID(id uint) (*models.User, error) {
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// --- Set Refresh Token Cookie ---
func SetRefreshCookie(c interface {
	SetCookie(string, string, int, string, string, bool, bool)
}, token string) {
	days, _ := strconv.Atoi(config.GetEnv("REFRESH_TOKEN_EXPIRY_DAYS"))
	if days == 0 {
		days = 7
	}
	c.SetCookie("refresh_token", token, days*24*60*60, "/", "", false, true)
}

// --- Get User Info from Google API ---
func GetUserInfoFromGoogle(accessToken string) (*GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var info GoogleUserInfo
	json.Unmarshal(body, &info)
	return &info, nil
}
