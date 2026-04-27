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
	"strings"
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
	expiry := getAccessTokenTTL()

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(expiry).Unix(),
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
		if t.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
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
	c.SetCookie("refresh_token", token, getRefreshCookieMaxAge(), "/", "", useSecureCookies(), true)
}

func ClearRefreshCookie(c interface {
	SetCookie(string, string, int, string, string, bool, bool)
}) {
	c.SetCookie("refresh_token", "", -1, "/", "", useSecureCookies(), true)
}

func GetFrontendURL() string {
	frontendURL := config.GetEnv("FRONTEND_URL")
	if frontendURL == "" {
		return "http://localhost:5173"
	}

	return strings.TrimRight(frontendURL, "/")
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

func getAccessTokenTTL() time.Duration {
	expiryMinutes, _ := strconv.Atoi(config.GetEnv("JWT_EXPIRY_MINUTES"))
	if expiryMinutes > 0 {
		return time.Duration(expiryMinutes) * time.Minute
	}

	expiryHours, _ := strconv.Atoi(config.GetEnv("JWT_EXPIRY_HOURS"))
	if expiryHours > 0 {
		return time.Duration(expiryHours) * time.Hour
	}

	return 15 * time.Minute
}

func getRefreshCookieMaxAge() int {
	days, _ := strconv.Atoi(config.GetEnv("REFRESH_TOKEN_EXPIRY_DAYS"))
	if days == 0 {
		days = 7
	}

	return days * 24 * 60 * 60
}

func useSecureCookies() bool {
	return strings.EqualFold(config.GetEnv("COOKIE_SECURE"), "true")
}
