package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"uniqueIndex"`
	Password string `json:"-"`
	GoogleID string `json:"google_id"`
	Provider string `json:"provider"`
	Avatar   string `json:"avatar"`
}
