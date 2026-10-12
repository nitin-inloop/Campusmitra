# Campus Mitra RAG API Documentation

## Overview

The Campus Mitra RAG API is a FastAPI-based backend service that provides:
- User authentication and authorization
- PDF file upload and management
- RAG (Retrieval-Augmented Generation) based question answering system

**Base URL**: `http://localhost:8000` (development)  
**API Version**: 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Rate Limiting](#rate-limiting)
3. [Health Check Endpoints](#health-check-endpoints)
4. [Authentication Endpoints](#authentication-endpoints)
5. [File Management Endpoints](#file-management-endpoints)
6. [RAG Operations Endpoints](#rag-operations-endpoints)
7. [Error Handling](#error-handling)
8. [Request/Response Examples](#requestresponse-examples)

---

## Authentication

Most endpoints require authentication using **OAuth2 Bearer Token**. 

### How to Authenticate

1. **Register a new user** using `POST /auth/register`
2. **Login** using `POST /auth/token` to get an access token
3. **Include the token** in subsequent requests using the `Authorization` header:
   ```
   Authorization: Bearer <your_access_token>
   ```

### Token Expiration

Access tokens expire after **30 minutes** (configurable). You'll need to login again to get a new token after expiration.

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **60 requests per minute** per IP address
- **1000 requests per hour** per IP address

Rate limit information is included in response headers:
- `X-RateLimit-Limit-Minute`: Maximum requests per minute
- `X-RateLimit-Limit-Hour`: Maximum requests per hour

**Note**: Health check endpoints (`/`, `/health`, `/docs`, `/openapi.json`, `/redoc`) are exempt from rate limiting.

---

## Health Check Endpoints

### GET `/`

Basic health check endpoint.

**Authentication**: Not required  
**Rate Limiting**: Exempt

**Response**:
```json
{
  "status": "ok",
  "message": "Campus Mitra RAG API is running",
  "initialized": true,
  "mongodb_connected": true
}
```

**Status Codes**:
- `200 OK`: API is running

---

### GET `/health`

Detailed health check endpoint with system status.

**Authentication**: Not required  
**Rate Limiting**: Exempt

**Response**:
```json
{
  "status": "healthy",
  "message": "RAG system is ready",
  "initialized": true,
  "mongodb_connected": true
}
```

**Status Codes**:
- `200 OK`: System is healthy
- `200 OK` (initialized: false): System is still initializing

---

## Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Authentication**: Not required

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response** (`200 OK`):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "is_active": true
}
```

**Status Codes**:
- `200 OK`: User created successfully
- `400 Bad Request`: Invalid input (e.g., email format, username already exists)
- `500 Internal Server Error`: Server error during user creation

---

### POST `/auth/token`

Login and get an access token (OAuth2 compatible).

**Authentication**: Not required

**Request Body** (form data):
```
username: john_doe
password: secure_password_123
```

**Note**: This endpoint uses `application/x-www-form-urlencoded` format (OAuth2 standard).

**Response** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes**:
- `200 OK`: Login successful
- `401 Unauthorized`: Incorrect username or password

**Usage Example** (cURL):
```bash
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe&password=secure_password_123"
```

---

### GET `/auth/users/me`

Get current authenticated user's information.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**Response** (`200 OK`):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "is_active": true
}
```

**Status Codes**:
- `200 OK`: User information retrieved
- `401 Unauthorized`: Invalid or missing token

---

### GET `/auth/test-protected`

Test endpoint to verify authentication is working.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**Response** (`200 OK`):
```json
{
  "message": "Hello john_doe, this is a protected route!"
}
```

**Status Codes**:
- `200 OK`: Authentication successful
- `401 Unauthorized`: Invalid or missing token

---

## File Management Endpoints

### POST `/files/upload`

Upload a PDF file for the current user.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
Content-Type: multipart/form-data
```

**Request Body** (multipart form data):
- `file`: PDF file (binary)

**Response** (`200 OK`):
```json
{
  "id": "507f1f77bcf86cd799439012",
  "filename": "document.pdf",
  "status": "uploading",
  "message": "File uploaded successfully. Processing will begin shortly."
}
```

**File Status Values**:
- `uploading`: File is being uploaded
- `processing`: File is being processed and embedded
- `ready`: File is ready for RAG queries
- `error`: An error occurred during processing

**Note**: File processing happens in the background. The file status will change from `uploading` → `processing` → `ready` once embeddings are created.

**Status Codes**:
- `200 OK`: File uploaded successfully
- `400 Bad Request`: Invalid file (not a PDF, file too large, etc.)
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error during upload

**Usage Example** (cURL):
```bash
curl -X POST "http://localhost:8000/files/upload" \
  -H "Authorization: Bearer <your_access_token>" \
  -F "file=@/path/to/document.pdf"
```

---

### GET `/files/my-files`

Get all files uploaded by the current user.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**Response** (`200 OK`):
```json
{
  "files": [
    {
      "id": "507f1f77bcf86cd799439012",
      "user_id": "507f1f77bcf86cd799439011",
      "filename": "document.pdf",
      "original_filename": "My Document.pdf",
      "file_path": "/path/to/file/document.pdf",
      "file_size": 1048576,
      "file_hash": "5d41402abc4b2a76b9719d911017c592",
      "mime_type": "application/pdf",
      "status": "ready",
      "chunks_count": 150,
      "embedding_status": "completed",
      "uploaded_at": "2024-01-15T10:30:00Z",
      "processed_at": "2024-01-15T10:32:00Z",
      "last_accessed": null,
      "collection_name": "user_507f1f77bcf86cd799439011",
      "vector_ids": ["vec_1", "vec_2", ...],
      "tags": [],
      "description": null
    }
  ],
  "total_count": 1,
  "total_size_mb": 1.0
}
```

**Status Codes**:
- `200 OK`: Files retrieved successfully
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### GET `/files/{file_id}`

Get details of a specific file.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**Path Parameters**:
- `file_id` (string, required): The ID of the file to retrieve

**Response** (`200 OK`):
```json
{
  "id": "507f1f77bcf86cd799439012",
  "user_id": "507f1f77bcf86cd799439011",
  "filename": "document.pdf",
  "original_filename": "My Document.pdf",
  "file_path": "/path/to/file/document.pdf",
  "file_size": 1048576,
  "file_hash": "5d41402abc4b2a76b9719d911017c592",
  "mime_type": "application/pdf",
  "status": "ready",
  "chunks_count": 150,
  "embedding_status": "completed",
  "uploaded_at": "2024-01-15T10:30:00Z",
  "processed_at": "2024-01-15T10:32:00Z",
  "last_accessed": null,
  "collection_name": "user_507f1f77bcf86cd799439011",
  "vector_ids": ["vec_1", "vec_2", ...],
  "tags": [],
  "description": null
}
```

**Status Codes**:
- `200 OK`: File details retrieved
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: File not found or user doesn't have permission
- `500 Internal Server Error`: Server error

---

### DELETE `/files/{file_id}`

Delete a specific file.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**Path Parameters**:
- `file_id` (string, required): The ID of the file to delete

**Response** (`200 OK`):
```json
{
  "message": "File deleted successfully",
  "file_id": "507f1f77bcf86cd799439012"
}
```

**Status Codes**:
- `200 OK`: File deleted successfully
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: File not found or user doesn't have permission
- `500 Internal Server Error`: Server error during deletion

**Note**: Deleting a file also removes its embeddings from the vector store.

---

## RAG Operations Endpoints

### POST `/rag/ask`

Ask a question to the RAG system based on the user's uploaded documents.

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "question": "What is the main topic discussed in the documents?"
}
```

**Response** (`200 OK`):
```json
{
  "answer": "Based on the documents, the main topic is...",
  "status": "success"
}
```

**Status Codes**:
- `200 OK`: Question answered successfully
- `400 Bad Request`: Question is empty or invalid
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Error processing question

**Note**: 
- The RAG system only searches through documents uploaded by the authenticated user
- If the user has no documents or documents are still processing, the response may be limited
- Processing time depends on the number of documents and question complexity

**Usage Example** (cURL):
```bash
curl -X POST "http://localhost:8000/rag/ask" \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is cloud computing?"}'
```

---

### POST `/rag/ask-stream`

Ask a question with streaming response (Server-Sent Events).

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "question": "What is the main topic discussed in the documents?"
}
```

**Response** (`200 OK`):
Content-Type: `text/plain`  
Format: Server-Sent Events (SSE)

```
data: Based on
data:  the documents
data: , the main topic
data:  is...
data: 
```

**Status Codes**:
- `200 OK`: Streaming started
- `400 Bad Request`: Question is empty or invalid
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Error processing question

**Usage Example** (JavaScript):
```javascript
const response = await fetch('http://localhost:8000/rag/ask-stream', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ question: 'What is cloud computing?' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      console.log(data); // Process each chunk
    }
  }
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Authentication required or invalid token
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Common Error Scenarios

#### Authentication Errors

**401 Unauthorized** - Missing or invalid token:
```json
{
  "detail": "Not authenticated"
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "detail": "Incorrect username or password"
}
```

#### Rate Limiting

**429 Too Many Requests**:
```json
{
  "detail": "Rate limit exceeded: 60 requests per minute"
}
```

Response includes `Retry-After: 60` header.

#### Validation Errors

**400 Bad Request** - Empty question:
```json
{
  "detail": "Question cannot be empty"
}
```

**400 Bad Request** - Invalid file:
```json
{
  "detail": "File must be a PDF"
}
```

#### Resource Not Found

**404 Not Found**:
```json
{
  "detail": "File not found or you don't have permission to access it"
}
```

---

## Request/Response Examples

### Complete Workflow Example

#### 1. Register a new user
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "test_password_123"
  }'
```

#### 2. Login to get token
```bash
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test_user&password=test_password_123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### 3. Upload a PDF file
```bash
curl -X POST "http://localhost:8000/files/upload" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@document.pdf"
```

#### 4. Check file status
```bash
curl -X GET "http://localhost:8000/files/my-files" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 5. Ask a question
```bash
curl -X POST "http://localhost:8000/rag/ask" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of the document?"}'
```

---

## Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

You can test all endpoints directly from the Swagger UI interface.

---

## Notes

1. **File Processing**: After uploading a PDF, the file is processed in the background. Check the file status using `GET /files/{file_id}` or `GET /files/my-files` to see when it's ready.

2. **User Isolation**: Each user can only access their own files. The RAG system only searches through documents uploaded by the authenticated user.

3. **Token Security**: Keep your access tokens secure. Do not expose them in client-side code or commit them to version control.

4. **CORS**: The API is configured to allow CORS from all origins in development. Configure this properly for production.

5. **Vector Store**: The system uses ChromaDB for vector storage. Each user has their own collection for document embeddings.

---

## Support

For issues or questions, please refer to the project repository or contact the development team.


