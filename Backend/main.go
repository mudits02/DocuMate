package main

import (
	"documate/config"
	"documate/middleware"
	"documate/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()
	config.SetupGoogleOAuth()

	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	routes.SetupRoutes(r)

	r.Run(":8080")
}
