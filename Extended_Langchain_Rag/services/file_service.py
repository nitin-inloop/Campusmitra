import os
import hashlib
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
from fastapi import HTTPException, UploadFile
from bson import ObjectId
from schemas.mongodb import get_files_collection
from schemas.file_schema import PDFFile, FileStatus, FileUploadResponse, FileListResponse

async def upload_pdf(file: UploadFile, user_id: str) -> FileUploadResponse:
    """Upload a PDF file with user isolation"""
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Validate file size (50MB limit)
    max_file_size = 50 * 1024 * 1024  # 50MB
    file_content = await file.read()
    if len(file_content) > max_file_size:
        raise HTTPException(status_code=400, detail="File size too large. Maximum allowed size is 50MB")
    
    # Calculate file hash for deduplication
    file_hash = hashlib.md5(file_content).hexdigest()
    
    # Check if file already exists for this user
    files_collection = get_files_collection()
    existing_file = await files_collection.find_one({
        "user_id": user_id,
        "file_hash": file_hash
    })
    
    if existing_file:
        raise HTTPException(
            status_code=400, 
            detail="File already exists in your library"
        )
    
    # Create user-specific directory
    base_pdf_dir = "e:\\Programming\\Artifical_intelligence\\CampusMitra\\Extended_Langchain_Rag\\PDFs"
    user_pdf_dir = os.path.join(base_pdf_dir, f"user_{user_id}")
    os.makedirs(user_pdf_dir, exist_ok=True)
    
    # Generate unique filename to prevent conflicts
    file_extension = ".pdf"
    base_filename = file.filename.rsplit('.', 1)[0]
    filename = f"{base_filename}{file_extension}"
    counter = 1
    
    while os.path.exists(os.path.join(user_pdf_dir, filename)):
        filename = f"{base_filename}_{counter}{file_extension}"
        counter += 1
    
    file_path = os.path.join(user_pdf_dir, filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Create file document (let MongoDB generate the _id)
    file_doc = {
        "user_id": user_id,
        "filename": filename,
        "original_filename": file.filename,
        "file_path": file_path,
        "file_size": len(file_content),
        "file_hash": file_hash,
        "status": FileStatus.UPLOADING.value,
        "chunks_count": None,
        "embedding_status": "pending",
        "uploaded_at": datetime.now(timezone.utc),
        "processed_at": None,
        "last_accessed": None,
        "collection_name": f"user_{user_id}_embeddings",
        "vector_ids": [],
        "tags": [],
        "description": None,
        "mime_type": "application/pdf"
    }
    
    # Save to MongoDB and get the generated _id
    result = await files_collection.insert_one(file_doc)
    file_id = str(result.inserted_id)
    
    return FileUploadResponse(
        id=file_id,
        filename=filename,
        status=FileStatus.UPLOADING,
        message="File uploaded successfully and queued for processing"
    )

async def get_user_files(user_id: str) -> FileListResponse:
    """Get all files for a specific user"""
    files_collection = get_files_collection()
    
    # Get user's files
    cursor = files_collection.find({"user_id": user_id})
    files = []
    total_size = 0
    
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        file_obj = PDFFile(**doc)
        files.append(file_obj)
        total_size += file_obj.file_size
    
    return FileListResponse(
        files=files,
        total_count=len(files),
        total_size_mb=total_size / (1024 * 1024)
    )

async def delete_user_file(file_id: str, user_id: str) -> dict:
    """Delete a file with ownership validation"""
    files_collection = get_files_collection()
    
    # Find the file and validate ownership
    file_doc = await files_collection.find_one({
        "_id": ObjectId(file_id),
        "user_id": user_id
    })
    
    if not file_doc:
        raise HTTPException(
            status_code=404,
            detail="File not found or you don't have permission to delete it"
        )
    
    # Delete physical file
    try:
        if os.path.exists(file_doc["file_path"]):
            os.remove(file_doc["file_path"])
            
            # Remove empty user directory if no more files
            user_dir = os.path.dirname(file_doc["file_path"])
            if os.path.exists(user_dir) and not os.listdir(user_dir):
                os.rmdir(user_dir)
                
    except Exception as e:
        # Log the error but don't fail the deletion
        print(f"Warning: Could not delete physical file: {e}")
    
    # Delete from MongoDB
    await files_collection.delete_one({"_id": ObjectId(file_id)})
    
    return {
        "message": "File deleted successfully",
        "filename": file_doc["filename"]
    }

async def update_file_status(file_id: str, status: FileStatus, **kwargs) -> bool:
    """Update file processing status"""
    files_collection = get_files_collection()
    
    update_data = {"status": status.value}
    
    # Add optional fields
    if "chunks_count" in kwargs:
        update_data["chunks_count"] = kwargs["chunks_count"]
    if "embedding_status" in kwargs:
        update_data["embedding_status"] = kwargs["embedding_status"]
    if status == FileStatus.READY:
        update_data["processed_at"] = datetime.now(timezone.utc)
    
    result = await files_collection.update_one(
        {"_id": ObjectId(file_id)},
        {"$set": update_data}
    )
    
    return result.modified_count > 0

async def get_file_by_id(file_id: str, user_id: str) -> Optional[PDFFile]:
    """Get a specific file by ID with ownership validation"""
    files_collection = get_files_collection()
    
    file_doc = await files_collection.find_one({
        "_id": ObjectId(file_id),
        "user_id": user_id
    })
    
    if not file_doc:
        return None
    
    file_doc["id"] = str(file_doc["_id"])
    return PDFFile(**file_doc)