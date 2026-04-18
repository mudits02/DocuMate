package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	// TODO: implement
	c.JSON(http.StatusOK, gin.H{"message": "register"})
}

func Login(c *gin.Context) {
	// TODO: implement
	c.JSON(http.StatusOK, gin.H{"message": "login"})
}

func GoogleLogin(c *gin.Context) {
	// TODO: implement
	c.JSON(http.StatusOK, gin.H{"message": "google login"})
}

func GoogleCallback(c *gin.Context) {
	// TODO: implement
	c.JSON(http.StatusOK, gin.H{"message": "google callback"})
}

func GetMe(c *gin.Context) {
	// TODO: implement
	c.JSON(http.StatusOK, gin.H{"message": "me"})
}
