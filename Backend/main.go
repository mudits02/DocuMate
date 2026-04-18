package main

import (
	"documate/config"
	"documate/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()

	r := gin.Default()

	routes.SetupRoutes(r)

	r.Run(":8080")
}
