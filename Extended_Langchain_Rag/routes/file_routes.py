"""
File Management Routes - Defines API endpoints for file operations
"""
from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from services.auth_service import get_current_active_user
from schemas.file_schema import FileUploadResponse, FileListResponse, PDFFile
from controllers import file_controller

router = APIRouter(prefix="/files", tags=["File Management"])


@router.post("/upload", response_model=FileUploadResponse)
async def upload_pdf_file(
    background_tasks: BackgroundTasks,
    current_user: Annotated[dict, Depends(get_current_active_user)],
    file: UploadFile = File(...)
):
    """Upload a PDF file for the current user"""
    return await file_controller.handle_file_upload(current_user, file, background_tasks)


@router.get("/my-files", response_model=FileListResponse)
async def get_my_files(
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Get all files for the current user"""
    return await file_controller.get_user_file_list(current_user)


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Delete a specific file"""
    return await file_controller.delete_file_by_id(file_id, current_user)


@router.get("/{file_id}", response_model=PDFFile)
async def get_file(
    file_id: str,
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Get details of a specific file"""
    return await file_controller.get_file_details(file_id, current_user)