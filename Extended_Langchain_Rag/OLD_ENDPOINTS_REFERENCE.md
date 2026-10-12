"""
OLD ENDPOINTS - For Reference Only
===================================

These are the legacy endpoints that existed before the modular refactoring.
They are kept in app.py for backward compatibility.

IMPORTANT: For new development, use the modular endpoints instead!

---

## Legacy Question Answering Endpoints

### POST /ask
- **Description**: Ask a question to the RAG system (non-streaming)
- **Request Body**: 
  ```json
  {
    "question": "Your question here"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "The answer...",
    "status": "success"
  }
  ```
- **Note**: This endpoint uses the GLOBAL RAG chain, not user-specific documents
- **New Alternative**: Use `/rag/ask` with authentication for user-specific queries

---

### POST /ask-sync
- **Description**: Synchronous version of ask endpoint
- **Request Body**: Same as `/ask`
- **Response**: Same as `/ask`
- **Note**: Forces synchronous execution (no streaming)
- **New Alternative**: Use `/rag/ask` with authentication

---

### POST /ask-stream
- **Description**: Ask a question with Server-Sent Events streaming
- **Request Body**: Same as `/ask`
- **Response**: Streams chunks as SSE format
- **Note**: Uses GLOBAL RAG chain
- **New Alternative**: Use `/rag/ask-stream` with authentication

---

## Legacy File Management Endpoints

### POST /upload-pdf
- **Description**: Upload a PDF file to the global PDFs directory
- **Request**: Multipart form-data with file
- **Response**:
  ```json
  {
    "message": "PDF uploaded successfully",
    "filename": "example.pdf",
    "status": "success"
  }
  ```
- **Note**: 
  - No user isolation - files go to global PDFs directory
  - No authentication required
  - Immediately processes and adds to global vector store
- **New Alternative**: Use `/files/upload` with authentication for user-specific uploads

---

### GET /list-pdfs
- **Description**: List all PDF files in the global PDFs directory
- **Response**:
  ```json
  {
    "pdfs": ["file1.pdf", "file2.pdf"],
    "count": 2,
    "status": "success"
  }
  ```
- **Note**: Shows ALL PDFs, not user-specific
- **New Alternative**: Use `/files/my-files` with authentication for user-specific files

---

### DELETE /delete-pdf/{filename}
- **Description**: Delete a PDF file from the global PDFs directory
- **Path Parameter**: filename (string)
- **Response**:
  ```json
  {
    "message": "PDF deleted successfully",
    "filename": "example.pdf",
    "status": "success"
  }
  ```
- **Note**: 
  - No authentication required
  - Deletes from global directory
  - Updates global vector store
- **New Alternative**: Use `/files/{file_id}` DELETE with authentication

---

## Health Check Endpoints (Still Active)

### GET /
- **Description**: Basic health check
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Campus Mitra RAG API is running",
    "initialized": true,
    "mongodb_connected": true
  }
  ```
- **Note**: This endpoint is still the recommended health check

---

### GET /health
- **Description**: Detailed health check
- **Response**: Same as `/` but with more detailed status
- **Note**: This endpoint is still recommended for monitoring

---

## Why These Endpoints Still Exist

1. **Backward Compatibility**: Existing clients/frontends may depend on these endpoints
2. **Testing**: Useful for quick testing without authentication
3. **Legacy Support**: Gradual migration path for existing users

---

## Migration Guide

### For Question Answering:
```
OLD: POST /ask
NEW: POST /rag/ask (requires authentication)
```

### For File Upload:
```
OLD: POST /upload-pdf
NEW: POST /files/upload (requires authentication, user-isolated)
```

### For File Listing:
```
OLD: GET /list-pdfs
NEW: GET /files/my-files (requires authentication, user-specific)
```

### For File Deletion:
```
OLD: DELETE /delete-pdf/{filename}
NEW: DELETE /files/{file_id} (requires authentication, user-specific)
```

---

## New Features Not Available in Old Endpoints

1. **User Authentication**: JWT-based authentication system
2. **User Isolation**: Each user has their own files and vector collections
3. **File Metadata**: Comprehensive file tracking (size, hash, status, etc.)
4. **Background Processing**: Files are processed asynchronously
5. **File Deduplication**: Prevents duplicate uploads
6. **Better Error Handling**: More detailed error messages
7. **User Management**: Registration, login, user info endpoints

---

## Architecture Comparison

### Old Architecture:
```
app.py (monolithic)
├── All endpoints in one file
├── Global RAG chain
├── Global PDF directory
└── No authentication
```

### New Architecture:
```
📁 controllers/     # Business logic
📁 routes/          # API endpoints
📁 services/        # Reusable services
📁 schemas/         # Data models
└── app.py          # Main app + legacy endpoints
```

---

## Deprecation Notice

⚠️ **IMPORTANT**: The legacy endpoints (/ask, /upload-pdf, /list-pdfs, /delete-pdf) 
may be removed in future versions. Please migrate to the new modular endpoints.

For questions or assistance with migration, refer to the API documentation at:
http://localhost:8000/docs

---

Last Updated: October 1, 2025
"""