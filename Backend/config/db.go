package config

import (
	"documate/models"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}
}

func ConnectDB() {
	db, err := gorm.Open(sqlite.Open("documate.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&models.User{})

	DB = db
	log.Println("Database connected!")
}

func GetEnv(key string) string {
	return os.Getenv(key)
}
