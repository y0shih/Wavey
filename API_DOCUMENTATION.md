# API Documentation

## Base URL
`http://localhost:3000`

## Authentication
This API uses JWT (JSON Web Token) authentication. After logging in, include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Creates a new user account.

**Required Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" (optional)
}
```

**Validation Rules:**
- `email`: Valid email format (required)
- `password`: Minimum 6 characters (required)
- `name`: Optional string

**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 2. Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Required Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 3. Get User Profile
**GET** `/auth/profile`

Returns the current user's profile information.

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-10-01T10:00:00.000Z",
  "updatedAt": "2023-10-01T10:00:00.000Z"
}
```

## Songs Endpoints
⚠️ **Note:** All songs endpoints require authentication. Include the JWT token in the Authorization header.

### 1. Create Song
**POST** `/songs`

Creates a new song with validation.

**Required Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "title": "string (required)",
  "artist": ["string[]"] (required),
  "album": "string (required)", 
  "genre": "string (optional)",
  "releaseDate": "YYYY-MM-DD (required)",
  "duration": "HH:MM (required, military time format)"
}
```

**Validation Rules:**
- `title`: Non-empty string
- `artist`: Non-empty array of strings
- `album`: Non-empty string
- `genre`: Optional string
- `releaseDate`: Valid ISO date string
- `duration`: Military time format (HH:MM)

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": ["Artist Name"],
  "album": "Album Name",
  "genre": "Rock",
  "releaseDate": "2023-10-01T00:00:00.000Z",
  "duration": "03:34"
}
```

### 2. Get All Songs
**GET** `/songs`

Retrieves all songs.

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Song Title",
    "artist": ["Artist Name"],
    "album": "Album Name", 
    "genre": "Rock",
    "releaseDate": "2023-10-01T00:00:00.000Z",
    "duration": "03:34"
  }
]
```

### 3. Get Song by ID
**GET** `/songs/:id`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `id`: Song ID (integer)

**Response:** `200 OK` or `404 Not Found`

### 4. Update Song (Full Update)
**PUT** `/songs/:id`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `id`: Song ID (integer)

**Request Body:** Same as Create Song (all fields required)

### 5. Update Song (Partial Update)
**PATCH** `/songs/:id`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `id`: Song ID (integer)

**Request Body:** Partial song object (any combination of fields)

### 6. Delete Song
**DELETE** `/songs/:id`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `id`: Song ID (integer)

**Response:** `200 OK`
```json
{
  "message": "Song with ID 1 has been deleted"
}
```

### 7. Search Songs
**GET** `/songs/search?q={query}`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `q`: Search query (required)

### 8. Get Songs by Genre
**GET** `/songs/genre/:genre`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `genre`: Genre name (string)

### 9. Get Songs by Artist
**GET** `/songs/artist/:artist`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `artist`: Artist name (string, partial match)

### 10. Get Songs by Album
**GET** `/songs/album/:album`

**Required Headers:**
- `Authorization: Bearer <jwt_token>`

**Parameters:**
- `album`: Album name (string, partial match)

### 11. Special Endpoints (Placeholders)
**Required Headers for all:** `Authorization: Bearer <jwt_token>`
- **GET** `/songs/popular` - Popular songs
- **GET** `/songs/recent` - Recent songs  
- **GET** `/songs/top` - Top songs

## Error Responses

**400 Bad Request** - Validation errors
```json
{
  "message": ["title should not be empty", "duration must be a valid representation of military time"],
  "error": "Bad Request",
  "statusCode": 400
}
```

**401 Unauthorized** - Authentication errors
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

**401 Unauthorized** - Invalid credentials (login)
```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

**401 Unauthorized** - Email already exists (register)
```json
{
  "message": "Email already exists",
  "statusCode": 401
}
```

**404 Not Found** - Song not found
```json
{
  "message": "Song with ID 999 not found",
  "error": "Not Found", 
  "statusCode": 404
}
```

**500 Internal Server Error** - Server errors
```json
{
  "message": "Server error",
  "statusCode": 500
}
```
