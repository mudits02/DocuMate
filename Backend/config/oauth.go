package config

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

var GoogleOAuthConfig *oauth2.Config
var GitHubOAuthConfig *oauth2.Config

func SetupGoogleOAuth() {
	GoogleOAuthConfig = &oauth2.Config{
		ClientID:     GetEnv("GOOGLE_CLIENT_ID"),
		ClientSecret: GetEnv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  GetEnv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func SetupGitHubOAuth() {
	GitHubOAuthConfig = &oauth2.Config{
		ClientID:     GetEnv("GITHUB_CLIENT_ID"),
		ClientSecret: GetEnv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  GetEnv("GITHUB_REDIRECT_URL"),
		Scopes: []string{
			"read:user",
			"user:email",
		},
		Endpoint: github.Endpoint,
	}
}
