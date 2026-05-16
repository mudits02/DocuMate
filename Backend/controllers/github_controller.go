package controllers

import (
	"documate/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetRepoTree(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	owner := c.Param("owner")
	repo := c.Param("repo")
	ref := c.DefaultQuery("ref", "HEAD")

	tree, truncated, err := services.GetRepoTreeForUser(userID.(uint), owner, repo, ref)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tree":      tree,
		"truncated": truncated,
		"ref":       ref,
	})
}

func GetRepoFileContent(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	owner := c.Param("owner")
	repo := c.Param("repo")
	ref := c.DefaultQuery("ref", "HEAD")
	filePath := c.Query("path")

	if filePath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "path is required"})
		return
	}

	file, err := services.GetRepoFileContentForUser(userID.(uint), owner, repo, ref, filePath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, file)
}
