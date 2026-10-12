# schemas/file_schema.py
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
from bson import ObjectId

class FileStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    ERROR = "error"

class PDFFile(BaseModel):
    id: Optional[str] = None
    user_id: str  # Reference to user who owns this file
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    file_hash: str  # MD5 hash for deduplication
    mime_type: str = "application/pdf"
    
    # Processing status
    status: FileStatus = FileStatus.UPLOADING
    chunks_count: Optional[int] = None
    embedding_status: str = "pending"  # pending, processing, completed, failed
    
    # Metadata
    uploaded_at: datetime
    processed_at: Optional[datetime] = None
    last_accessed: Optional[datetime] = None
    
    # Vector store references
    collection_name: Optional[str] = None  # Which vector collection this file belongs to
    vector_ids: List[str] = []  # IDs of vector embeddings for this file
    
    # Additional metadata
    tags: List[str] = []
    description: Optional[str] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class FileUploadResponse(BaseModel):
    id: str
    filename: str
    status: FileStatus
    message: str

class FileListResponse(BaseModel):
    files: List[PDFFile]
    total_count: int
    total_size_mb: float