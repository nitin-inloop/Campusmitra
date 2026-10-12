# Campus Mitra RAG API - Modular Implementation Instructions

## Overview
This document provides step-by-step instructions for an AI agent to transform the existing Campus Mitra RAG API from a single-file architecture to a modular, multi-user system with MongoDB integration while preserving all existing functionality.

## Prerequisites
- Existing RAG system with Supabase vector database is **ALREADY DEPLOYED** and working
- Supabase PostgreSQL with pgvector extension is configured and accessible
- Python environment with existing dependencies installed
- MongoDB connection available (local or cloud) for user management and file metadata only

## Important: Database Architecture
⚠️ **CRITICAL**: 
- **Supabase**: Used ONLY for vector embeddings storage (already deployed and working)
- **MongoDB**: Used ONLY for user accounts and file metadata
- Do NOT modify the existing Supabase vector database setup or connection
- The modular implementation must work WITH your existing Supabase deployment, not replace it

## Phase 1: Project Structure Setup

### Step 1: Create Directory Structure
Execute these commands in the `Extended_Langchain_Rag` directory:

```powershell
mkdir services
mkdir routes
New-Item -Path "schemas\__init__.py" -ItemType File -Force
New-Item -Path "services\__init__.py" -ItemType File -Force  
New-Item -Path "routes\__init__.py" -ItemType File -Force
```

### Step 2: Update Dependencies
Add the following packages to `requirements.txt`:

```txt
# MongoDB for user management and file metadata
motor==3.5.1
pymongo==4.8.0

# FastAPI OAuth2 Authentication (following FastAPI official pattern)
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

Install new dependencies:
```bash
pip install motor pymongo python-jose[cryptography] passlib[bcrypt] python-multipart
```

## Phase 2: Schema Implementation

### Step 3: Fix File Schema
Update `schemas/file_schema.py` to include missing imports:

```python
# Add these imports at the top
from typing import Optional, Dict, Any, List  # Add List
from bson import ObjectId  # Add ObjectId import
```

### Step 4: Create Authentication Service
Create `services/auth_service.py`:

**Use FastAPI OAuth2 Pattern** (based on FastAPI official documentation):

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel
from bson import ObjectId
from schemas.mongodb import mongodb

# Generate with: openssl rand -hex 32
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

**Key Requirements:**
- Follow FastAPI OAuth2PasswordBearer pattern exactly
- Use MongoDB instead of fake_users_db for user storage
- Implement timezone-aware datetime (datetime.now(timezone.utc))
- Use proper JWT exception handling (InvalidTokenError)
- Password hashing using bcrypt with CryptContext

**Critical Functions:**
- `verify_password()` - Verify password against hash
- `get_password_hash()` - Hash passwords securely
- `create_access_token()` - Generate JWT tokens with proper expiration
- `get_user()` - Get user from MongoDB by username
- `authenticate_user()` - Login validation
- `get_current_user()` - Extract user from JWT (OAuth2 dependency)
- `get_current_active_user()` - Check if user is active

### Step 5: Create File Service  
Create `services/file_service.py`:

**Key Requirements:**
- User-specific file upload to `PDFs/user_{user_id}/` directories
- File deduplication using MD5 hashing
- Filename conflict prevention
- File metadata storage in MongoDB
- User-specific file listing and deletion
- Physical file cleanup on deletion

**Critical Functions:**
- `upload_pdf()` - Handle file upload with user isolation
- `get_user_files()` - List files for specific user
- `delete_user_file()` - Delete with ownership validation
- `update_file_status()` - Update processing status

### Step 6: Create RAG Service
Create `services/rag_service.py`:

**Key Requirements:**
- User-specific vector store collections (`user_{user_id}_embeddings`)
- Integration with existing RAGBOT class
- Background file processing
- User-specific RAG chain creation
- User-specific document querying

**Critical Functions:**
- `process_user_file()` - Process files for user-specific collections
- `create_user_rag_chain()` - Create user-specific RAG chains
- `query_user_documents()` - Query only user's documents

**IMPORTANT:** Use existing `RAGBOT` methods but with user-specific collection names. Your Supabase vector database is already deployed and working - do NOT change the connection setup, only extend it to support user-specific collections.

## Phase 3: Route Implementation

### Step 7: Create Authentication Routes
Create `routes/auth_routes.py`:

**Follow FastAPI OAuth2 Pattern:**

```python
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    # Authenticate user logic here
    # Return Token with access_token and token_type="bearer"
```

**Endpoints to implement:**
- `POST /auth/token` - OAuth2 token endpoint (follows FastAPI standard)
- `POST /auth/register` - User registration
- `GET /auth/users/me` - Get current user info

**Response Models:**
- `Token` with access_token, token_type
- Use OAuth2PasswordRequestForm for login
- Proper error handling with HTTP status codes

### Step 8: Create File Routes
Create `routes/file_routes.py`:

**Authentication Integration:**
```python
from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from schemas.user import User
from services.auth_service import get_current_active_user

router = APIRouter(prefix="/files", tags=["File Management"])

@router.post("/upload")
async def upload_pdf(
    current_user: Annotated[User, Depends(get_current_active_user)],
    file: UploadFile = File(...)
):
    # User-specific file upload logic
```

**Endpoints to implement:**
- `POST /files/upload` - Upload with background processing
- `GET /files/my-files` - List user's files
- `DELETE /files/{file_id}` - Delete user's file
- `GET /files/{file_id}` - Get file details

**Key Features:**
- All endpoints use `get_current_active_user` dependency
- Background task integration for file processing
- User ownership validation for all operations

## Phase 4: Main Application Update

### Step 9: Update Main App
Modify `app.py`:

**Changes Required:**
1. Replace MongoDB connection in lifespan
2. Import and include route modules
3. Remove old file management endpoints
4. Keep existing RAG endpoints for backward compatibility
5. Update health check to include MongoDB status

**Preserve These Endpoints:**
- `GET /` - Health check
- `GET /health` - Detailed health check  
- `POST /ask` - Question answering (keep for backward compatibility)
- `POST /ask-sync` - Synchronous question answering
- `POST /ask-stream` - Streaming response

**Remove These Endpoints:**
- `POST /upload-pdf` (replaced by `/files/upload`)
- `GET /list-pdfs` (replaced by `/files/my-files`)
- `DELETE /delete-pdf/{filename}` (replaced by `/files/{file_id}`)

## Phase 5: Database Integration

### Step 10: MongoDB Setup
Ensure `schemas/mongodb.py` includes:

**Required Indexes:**
- `users.email` (unique)
- `users.username` (unique)
- `files.user_id`
- `files.file_hash`
- `files.user_id + filename` (compound unique)

**Collections:**
- `users` - User accounts
- `files` - File metadata and status

### Step 11: Environment Variables
Add to `.env` file:

```env
# MongoDB Configuration (for user accounts and file metadata only)
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
MONGODB_DATABASE=campus_mitra

# JWT Configuration (use OpenSSL to generate: openssl rand -hex 32)
JWT_SECRET_KEY=your-super-secret-key-change-in-production

# Existing Supabase/RAG configuration (KEEP UNCHANGED - already deployed)
# Supabase is used ONLY for vector embeddings storage
USE_SUPABASE=true
SUPABASE_PASSWORD=your-existing-password
SUPABASE_PROJECT_ID=your-existing-project-id
GEMINI_API_KEY=your-existing-key
HUGGINGFACE_API_TOKEN=your-existing-token
```

## Phase 6: Integration Testing

### Step 12: Backward Compatibility Testing
Test these existing endpoints still work:

```bash
# Health check
curl http://localhost:8000/

# Question answering (should still work)
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "test question"}'
```

### Step 13: New Feature Testing
Test new OAuth2 authentication flow:

```bash
# Register user (if registration endpoint exists)
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'

# Login user (OAuth2 token endpoint)
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"

# Get current user info
curl -X GET http://localhost:8000/auth/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload file (with token)
curl -X POST http://localhost:8000/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf"
```

## Phase 7: User-Specific RAG Integration

### Step 14: Modify RAG Pipeline for Users
**Important:** Do NOT change the core `RAGBOT` class functionality or Supabase connection

**Your Supabase Setup:**
- Vector database is already deployed and working
- Connection strings and credentials are configured
- pgvector extension is enabled
- Current collections are functional

**Required Changes:**
1. Use user-specific collection names in existing Supabase database
2. Modify `load_and_embed_documents()` to accept collection_name parameter
3. Ensure user isolation within the same Supabase instance
4. Keep existing connection parameters unchanged

**Collection Naming:**
- Format: `user_{user_id}_embeddings`
- Each user gets isolated collections within your existing Supabase database
- Existing global collection can remain for backward compatibility
- All collections use the same Supabase connection and credentials

### Step 15: User-Specific Querying
Create new endpoints for user-specific querying:

```python
from typing import Annotated
from fastapi import Depends
from services.auth_service import get_current_active_user

@router.post("/ask-user")
async def ask_user_documents(
    request: QuestionRequest,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # Query only the current user's documents in Supabase
    response = await RAGService.query_user_documents(current_user.id, request.question)
    return QuestionResponse(answer=response, status="success")
```

## Phase 8: Error Handling & Logging

### Step 16: Comprehensive Error Handling
Ensure all services include:

- Database connection error handling
- File system error handling with cleanup
- Authentication error responses
- User-friendly error messages
- Proper HTTP status codes

### Step 17: Logging Implementation
Add logging to all services:

```python
import logging
logger = logging.getLogger(__name__)

# Log important events:
# - User registration/login
# - File uploads/deletions  
# - Processing status changes
# - Error conditions
```

## Phase 9: Security Considerations

### Step 18: Security Best Practices
Implement:

- Password hashing (never store plain passwords)
- JWT token expiration
- File upload validation (size, type)
- User isolation for all operations
- Input validation and sanitization
- CORS configuration for production

### Step 19: File Security
Ensure:

- User-specific file directories
- File ownership validation on all operations
- Secure file deletion (both filesystem and database)
- Prevention of directory traversal attacks

## Phase 10: Production Readiness

### Step 20: Configuration Management
Separate development/production configs:

- Environment-specific database connections
- Secure JWT secret keys
- Appropriate CORS settings
- File upload limits
- Rate limiting considerations

### Step 21: Documentation Updates
Update API documentation to include:

- Authentication flow
- New endpoints
- User-specific operations
- Backward compatibility notes
- Migration guide for existing users

## Validation Checklist

### Functionality Preservation ✅
- [ ] Existing health check endpoints work
- [ ] RAG question-answering endpoints work  
- [ ] Supabase vector database connection remains intact
- [ ] Existing PDF processing works with current Supabase setup

### New Features ✅
- [ ] User registration/login works
- [ ] JWT authentication works
- [ ] User-specific file upload works
- [ ] File listing shows only user's files
- [ ] File deletion validates ownership
- [ ] Background processing works
- [ ] User-specific RAG querying works

### Security ✅
- [ ] Passwords are properly hashed
- [ ] JWT tokens are validated
- [ ] File operations check user ownership
- [ ] No information leakage between users
- [ ] File uploads are validated

### Database ✅
- [ ] MongoDB connection works
- [ ] Indexes are created
- [ ] User collection works
- [ ] File collection works
- [ ] Supabase vector database connection remains unchanged and functional

## Important Notes

1. **Database Architecture**: 
   - **Supabase**: ONLY for vector embeddings (already deployed, do not modify)
   - **MongoDB**: ONLY for user accounts and file metadata
2. **Authentication**: Follow FastAPI OAuth2PasswordBearer pattern exactly
3. **Do NOT modify the core RAGBOT class** - only extend it
4. **Preserve all existing endpoints** for backward compatibility
5. **Test thoroughly** after each phase
6. **Use user-specific collections** within your existing Supabase database
7. **Maintain file isolation** between users
8. **Implement proper error handling** at each step
9. **Log all important operations** for debugging
10. **Validate user ownership** for all file operations
11. **Keep existing Supabase credentials and connection strings unchanged**
12. **Use timezone-aware datetime** for JWT tokens (datetime.now(timezone.utc))

## Troubleshooting Guide

### Common Issues:
1. **Import errors** - Ensure all `__init__.py` files exist
2. **Database connection** - Check MongoDB connection string
3. **JWT errors** - Verify secret key configuration
4. **File permissions** - Ensure proper directory permissions
5. **Supabase connection issues** - DO NOT change existing Supabase settings, verify they remain intact

### Debug Steps:
1. Check logs for specific error messages
2. Test each service individually
3. Verify environment variables
4. Test database connections
5. Validate file system permissions

This implementation maintains full backward compatibility while adding user authentication and multi-user support with proper data isolation.
