package services

import (
	"context"
	"documate/config"
	"documate/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
)

type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

type GitHubUserInfo struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
	Email     string `json:"email"`
}

type GitHubEmail struct {
	Email    string `json:"email"`
	Primary  bool   `json:"primary"`
	Verified bool   `json:"verified"`
}

type GitHubRepo struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	FullName string `json:"full_name"`
	Private  bool   `json:"private"`
	HTMLURL  string `json:"html_url"`
}

func GetGoogleAuthURL(state string) string {
	return config.GoogleOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func GetGitHubAuthURL(state string) string {
	return config.GitHubOAuthConfig.AuthCodeURL(
		state,
		oauth2.SetAuthURLParam("prompt", "select_account"),
	)
}

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

func ExchangeGitHubCode(code string) (*oauth2.Token, error) {
	token, err := config.GitHubOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, errors.New("failed to exchange github token: " + err.Error())
	}

	return token, nil
}

func GetGitHubUserInfo(accessToken string) (*GitHubUserInfo, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, errors.New("failed to get github user profile: " + err.Error())
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("github profile request failed: %s", string(body))
	}

	var userInfo GitHubUserInfo
	json.Unmarshal(body, &userInfo)

	emails, err := GetGitHubEmails(accessToken)
	if err != nil {
		return nil, err
	}

	email := getPreferredGitHubEmail(emails)
	if email == "" {
		return nil, errors.New("github account has no verified email")
	}

	userInfo.Email = email

	if strings.TrimSpace(userInfo.Name) == "" {
		userInfo.Name = userInfo.Login
	}

	return &userInfo, nil
}

func GetGitHubEmails(accessToken string) ([]GitHubEmail, error) {
	req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, errors.New("failed to get github emails: " + err.Error())
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("github email request failed: %s", string(body))
	}

	var emails []GitHubEmail
	json.Unmarshal(body, &emails)
	return emails, nil
}

func getPreferredGitHubEmail(emails []GitHubEmail) string {
	for _, email := range emails {
		if email.Primary && email.Verified {
			return email.Email
		}
	}

	for _, email := range emails {
		if email.Verified {
			return email.Email
		}
	}

	return ""
}

func FindOrCreateGoogleUser(info *GoogleUserInfo) (*models.User, error) {
	var user models.User

	if err := config.DB.Where("google_id = ?", info.ID).First(&user).Error; err == nil {
		user.Name = info.Name
		user.Avatar = info.Picture
		user.Provider = "google"
		if err := config.DB.Save(&user).Error; err != nil {
			return nil, err
		}
		return &user, nil
	}

	if info.Email != "" {
		if err := config.DB.Where("email = ?", info.Email).First(&user).Error; err == nil {
			if user.GoogleID == "" {
				user.GoogleID = info.ID
			}
			user.Name = info.Name
			user.Avatar = info.Picture
			user.Provider = "google"

			if err := config.DB.Save(&user).Error; err != nil {
				return nil, err
			}
			return &user, nil
		}
	}

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

	return &user, nil
}

func FindOrCreateGitHubUser(info *GitHubUserInfo, accessToken string) (*models.User, error) {
	var user models.User
	githubID := strconv.FormatInt(info.ID, 10)

	if err := config.DB.Where("github_id = ?", githubID).First(&user).Error; err == nil {
		user.Name = info.Name
		user.Avatar = info.AvatarURL
		user.Provider = "github"
		user.GitHubUsername = info.Login
		user.GitHubAccessToken = accessToken

		if err := config.DB.Save(&user).Error; err != nil {
			return nil, err
		}
		return &user, nil
	}

	if info.Email != "" {
		if err := config.DB.Where("email = ?", info.Email).First(&user).Error; err == nil {
			if user.GitHubID == "" {
				user.GitHubID = githubID
			}
			user.Name = info.Name
			user.Avatar = info.AvatarURL
			user.Provider = "github"
			user.GitHubUsername = info.Login
			user.GitHubAccessToken = accessToken

			if err := config.DB.Save(&user).Error; err != nil {
				return nil, err
			}
			return &user, nil
		}
	}

	user = models.User{
		Name:              info.Name,
		Email:             info.Email,
		GitHubID:          githubID,
		GitHubUsername:    info.Login,
		GitHubAccessToken: accessToken,
		Provider:          "github",
		Avatar:            info.AvatarURL,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetGitHubReposForUser(userID uint) ([]GitHubRepo, error) {
	user, err := GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	if strings.TrimSpace(user.GitHubAccessToken) == "" {
		return nil, errors.New("github account is not connected")
	}

	req, err := http.NewRequest("GET", "https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+user.GitHubAccessToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, errors.New("failed to fetch github repos: " + err.Error())
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("github repos request failed: %s", string(body))
	}

	var repos []GitHubRepo
	json.Unmarshal(body, &repos)

	return repos, nil
}

func GenerateAccessToken(userID uint) (string, error) {
	expiry := getAccessTokenTTL()

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
}

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

func GetUserByID(id uint) (*models.User, error) {
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

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
