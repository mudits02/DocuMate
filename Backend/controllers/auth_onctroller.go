package controllers

import (
	"documate/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GoogleLogin(c *gin.Context) {
	// Generate a random state (for CSRF protection)
	state := "random_state_string" // TODO: make this truly random later
	url := services.GetGoogleAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code not found"})
		return
	}

	// Get user info from Google
	userInfo, err := services.GetGoogleUserInfo(code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Find or create user in DB
	user, err := services.FindOrCreateGoogleUser(userInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save user"})
		return
	}

	// Generate tokens
	accessToken, err := services.GenerateAccessToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	refreshToken, err := services.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate refresh token"})
		return
	}

	// Set refresh token in httpOnly cookie
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "", false, true)

	// Redirect frontend with access token
	c.Redirect(http.StatusTemporaryRedirect,
		"http://localhost:5173/auth/callback?token="+accessToken+
			"&name="+user.Name+
			"&email="+user.Email+
			"&avatar="+user.Avatar)
}

func GetMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := services.GetUserByID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":     user.ID,
		"name":   user.Name,
		"email":  user.Email,
		"avatar": user.Avatar,
	})
}

func RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no refresh token"})
		return
	}

	userID, err := services.ValidateToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	newAccessToken, err := services.GenerateAccessToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": newAccessToken})
}

func Logout(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

func Register(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "coming soon"})
}

func Login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "coming soon"})
}
