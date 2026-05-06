# Documate

## Frontend Setup
````shell
cd Frontend
````

````shell
npm install
````
````shell
npm run dev
````
<br>
If you want to create a production build , then run the following:

````shell
npm run build
````

After successful setup , u will see the following message on your terminal

````shell
VITE v8.0.8  ready in 290 ms

  ➜  Local:   http://localhost:5173/
````

### Routes Available

1. "/login" -> Redirects to the **Login** Page. Currently, only ***Google*** auth is working. **Gitlab** and **Github** authentication under development <br><br>
2. "/dashboard" -> **Dashboard** page , which the user will see after successful auth. Currently under development<br><br>

---

## Backend Setup

### Prerequisites
- Go 1.25.0 or higher installed
- SQLite (included with the project)

### Fresh Start Steps

1. **Navigate to the Backend directory**
   ````shell
   cd Backend
   ````

2. **Download dependencies**
   ````shell
   go mod download
   ````

3. **Verify environment variables** - Ensure `.env` file exists in the Backend directory with all required OAuth and JWT configurations

4. **Run the server**
   ````shell
   go run main.go
   ````

The server will start on **http://localhost:8080** with:
- SQLite database connection
- Google OAuth setup
- GitHub OAuth setup
- CORS middleware for frontend communication

### Troubleshooting

If you encounter dependency issues:
````shell
go mod tidy
go mod download
go run main.go
````

To clean Go cache:
````shell
go clean -cache
````

### Environment Variables Required

The `.env` file should contain:
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
- `JWT_SECRET`, `JWT_EXPIRY_HOURS`, `REFRESH_TOKEN_EXPIRY_DAYS`
- `FRONTEND_URL` (typically http://localhost:5173)
- `COOKIE_SECURE` (false for local development)