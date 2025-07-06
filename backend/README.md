# PixCloud API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication Routes
Base path: `/auth`

### Register
- **POST** `/auth/register`
- Creates a new user account
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

### Login
- **POST** `/auth/login`
- Authenticates a user and returns a token
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## Photo Routes
Base path: `/photos`

### Like Photo
- **PUT** `/photos/:photoId/like`
- Likes/unlikes a photo
- **Authentication:** Required
- **URL Parameters:**
  - photoId: ID of the photo

### View Photo
- **PUT** `/photos/:photoId/view`
- Records a view for the photo
- **Authentication:** Required
- **URL Parameters:**
  - photoId: ID of the photo

### Add Comment
- **POST** `/photos/:photoId/comment`
- Adds a comment to a photo
- **Authentication:** Required
- **URL Parameters:**
  - photoId: ID of the photo
- **Body:**
  ```json
  {
    "content": "string"
  }
  ```

### Reply to Comment
- **POST** `/photos/:photoId/comment/:commentIndex/reply`
- Adds a reply to an existing comment
- **Authentication:** Required
- **URL Parameters:**
  - photoId: ID of the photo
  - commentIndex: Index of the parent comment

## Upload and Photo Management Routes

### Get All Photos
- **GET** `/all-photos`
- Retrieves all photos in the system
- **Authentication:** Not required
- **Response:** List of photos sorted by upload date

### Get User Photos
- **GET** `/photos`
- Retrieves all photos uploaded by the authenticated user
- **Authentication:** Required

### Upload Photo
- **POST** `/upload`
- Uploads a new photo
- **Authentication:** Required
- **Body:** multipart/form-data
  ```json
  {
    "photo": "file",
    "title": "string",
    "description": "string",
    "author": "string (optional)"
  }
  ```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Error Responses
The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error
