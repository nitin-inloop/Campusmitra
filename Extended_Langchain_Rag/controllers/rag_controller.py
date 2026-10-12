"""
RAG Controller - Handles RAG operations business logic
"""
from fastapi import HTTPException
from services.rag_service import rag_service
from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    answer: str
    status: str


async def ask_question_to_documents(request: QuestionRequest, current_user: dict) -> QuestionResponse:
    """Process a question against user's documents"""
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    try:
        user_id = str(current_user["_id"])
        
        # Query user's documents
        answer = await rag_service.query_user_documents(user_id, request.question)
        
        return QuestionResponse(
            answer=answer,
            status="success"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your question: {str(e)}"
        )


async def stream_question_response(request: QuestionRequest, current_user: dict):
    """Stream response for a question against user's documents"""
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    async def generate_response():
        try:
            user_id = str(current_user["_id"])
            
            async for chunk in rag_service.query_user_documents_stream(user_id, request.question):
                if chunk:
                    yield f"data: {chunk}\n\n"
                    
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
    
    return generate_response()