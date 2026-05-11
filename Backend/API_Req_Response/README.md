# API Request & Response Formats

This folder documents the request and response formats for all backend APIs in Documate.

---

## Example Format

### Endpoint: `/api/auth/login`
- **Method:** POST

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Response (Success)
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Response (Error)
```json
{
  "error": "Invalid credentials"
}
```

---

## API List

Add a new section for each API endpoint following the above format.
