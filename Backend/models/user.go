package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name              string `json:"name"`
	Email             string `json:"email" gorm:"uniqueIndex"`
	Password          string `json:"-"`
	GoogleID          string `json:"google_id" gorm:"uniqueIndex"`
	GitHubID          string `json:"github_id" gorm:"column:github_id;uniqueIndex"`
	GitHubUsername    string `json:"github_username"`
	GitHubAccessToken string `json:"-" gorm:"column:github_access_token"`
	Provider          string `json:"provider"`
	Avatar            string `json:"avatar"`
}
