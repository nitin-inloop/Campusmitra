"""
RAG Operations Routes - Defines API endpoints for RAG functionality
"""
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from services.auth_service import get_current_active_user
from controllers.rag_controller import QuestionRequest, QuestionResponse
from controllers import rag_controller

router = APIRouter(prefix="/rag", tags=["RAG Operations"])


@router.post("/ask", response_model=QuestionResponse)
async def ask_question(
    request: QuestionRequest,
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Ask a question to the user's documents"""
    return await rag_controller.ask_question_to_documents(request, current_user)


@router.post("/ask-stream")
async def ask_question_stream(
    request: QuestionRequest,
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Ask a question to the user's documents with streaming response"""
    return StreamingResponse(
        await rag_controller.stream_question_response(request, current_user),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )