package routes

import (
	"documate/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.GET("/google", controllers.GoogleLogin)
			auth.GET("/google/callback", controllers.GoogleCallback)
			auth.GET("/me", controllers.GetMe)
			auth.POST("/refresh", controllers.RefreshToken)
			auth.POST("/logout", controllers.Logout)
		}
	}
}
