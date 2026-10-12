"""
File Controller - Handles file management business logic
"""
from typing import Annotated
from fastapi import HTTPException, UploadFile, BackgroundTasks
import logging
from services.file_service import (
    upload_pdf, 
    get_user_files, 
    delete_user_file, 
    get_file_by_id
)
from services.rag_service import rag_service
from schemas.file_schema import FileUploadResponse, FileListResponse, PDFFile

logger = logging.getLogger(__name__)


async def handle_file_upload(
    current_user: dict,
    file: UploadFile,
    background_tasks: BackgroundTasks
) -> FileUploadResponse:
    """Handle PDF file upload"""
    try:
        user_id = str(current_user["_id"])
        
        # Upload file and save metadata
        upload_response = await upload_pdf(file, user_id)
        
        # Add background task to process the file
        background_tasks.add_task(
            process_file_background,
            upload_response.id,
            user_id
        )
        
        return upload_response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )


async def get_user_file_list(current_user: dict) -> FileListResponse:
    """Get all files for the current user"""
    try:
        user_id = str(current_user["_id"])
        return await get_user_files(user_id)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get files: {str(e)}"
        )


async def delete_file_by_id(file_id: str, current_user: dict) -> dict:
    """Delete a specific file"""
    try:
        user_id = str(current_user["_id"])
        return await delete_user_file(file_id, user_id)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )


async def get_file_details(file_id: str, current_user: dict) -> PDFFile:
    """Get details of a specific file"""
    try:
        user_id = str(current_user["_id"])
        file_data = await get_file_by_id(file_id, user_id)
        
        if not file_data:
            raise HTTPException(
                status_code=404,
                detail="File not found or you don't have permission to access it"
            )
        
        return file_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get file details: {str(e)}"
        )


async def process_file_background(file_id: str, user_id: str):
    """Background task to process uploaded file"""
    try:
        logger.info(f"Background task started for file_id: {file_id}, user_id: {user_id}")
        
        # Get file details
        file_data = await get_file_by_id(file_id, user_id)
        
        if not file_data:
            logger.error(f"File not found: {file_id}")
            return
            
        logger.info(f"Processing file: {file_data.file_path}")
        
        # Process the file for RAG
        await rag_service.process_user_file(
            file_data.file_path, 
            user_id, 
            file_id
        )
        
        logger.info(f"Background task completed successfully for file_id: {file_id}")
        
    except Exception as e:
        logger.error(f"Error in background file processing for file {file_id}: {e}", exc_info=True)
        # Update file status to error is handled in rag_service