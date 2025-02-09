# TypeScript OAuth 2.0 REST API

## Introduction
This project implements a basic OAuth 2.0 authorization server using TypeScript and Express. It provides two main endpoints:
- **Authorization Endpoint** (`/authorize`) to issue authorization codes.
- **Token Endpoint** (`/token`) to exchange authorization codes for access tokens.

Additionally, a mock redirect server (`redirect-server.ts`) is included to simulate OAuth client behavior.

## Features
- Implements OAuth 2.0 authorization code flow.
- Issues JWT access tokens and refresh tokens.
- Uses environment variables for configuration.
- Validates OAuth requests to ensure security.
- Provides a mock redirect server to test authorization flows.

## Prerequisites
Ensure you have the following installed:
- Node.js (v14+ recommended)
- npm or yarn
- TypeScript (if not installed globally, it's included in `devDependencies`)

## Installation
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd <repository_directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration
Create a `.env` file in the root directory and set the following environment variables:
```env
PORT=8080
CLIENT_ID=upfirst
REDIRECT_URIS=http://localhost:8081/process
JWT_SECRET=KAVIL_SECRET_KEY
```

## Running the Server
To start both the OAuth 2.0 server and the redirect server:
```sh
npm start
```
This runs:
- The OAuth 2.0 server on **http://localhost:8080**
- The mock redirect server on **http://localhost:8081**

## Endpoints

### Authorization Endpoint
**URL:** `GET /api/oauth/authorize`

#### Request Parameters:
- `response_type=code` (Required)
- `client_id=upfirst` (Required)
- `redirect_uri=http://localhost:8081/process` (Required)
- `state=random_string` (Optional)

#### Example Request:
```sh
curl "http://localhost:8080/api/oauth/authorize?response_type=code&client_id=upfirst&redirect_uri=http://localhost:8081/process"
```
#### Response:
Redirects to `redirect_uri` with an authorization code.

---
### Token Endpoint
**URL:** `POST /api/oauth/token`

#### Request Parameters (Authorization Code Grant):
- `grant_type=authorization_code` (Required)
- `code=received_code` (Required)
- `client_id=upfirst` (Required)

#### Example Request:
```sh
curl -X POST "http://localhost:8080/api/oauth/token" \
     -H "Content-Type: application/json" \
     -d '{"grant_type": "authorization_code", "code": "your_code", "client_id": "upfirst"}'
```
#### Response:
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_value"
}
```

---
### Refresh Token Endpoint
**URL:** `POST /api/oauth/token`

#### Request Parameters:
- `grant_type=refresh_token` (Required)
- `refresh_token=your_refresh_token` (Required)
- `client_id=upfirst` (Required)

#### Example Request:
```sh
curl -X POST "http://localhost:8080/api/oauth/token" \
     -H "Content-Type: application/json" \
     -d '{"grant_type": "refresh_token", "refresh_token": "your_refresh_token", "client_id": "upfirst"}'
```
#### Response:
```json
{
  "access_token": "new_jwt_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "new_refresh_token"
}
```

## Project Structure
```
├── routes/
│   ├── authRoutes.ts  # Handles authorization requests
│   ├── tokenRoutes.ts # Handles token exchange
├── utils/
│   ├── storage.ts     # Stores temporary authorization codes and refresh tokens
│   ├── validators.ts  # Validates incoming requests
├── server.ts          # Main OAuth 2.0 server
├── redirect-server.ts # Mock redirect server for testing
├── .env               # Environment variables
├── package.json       # Project dependencies and scripts
```

## Troubleshooting
- **Server not starting?** Ensure `.env` contains `JWT_SECRET` and `CLIENT_ID`.
- **Invalid client_id error?** Check if the `client_id` in requests matches `.env`.
- **Invalid redirect_uri?** Ensure `REDIRECT_URIS` includes your redirect URI.

## License
MIT License

