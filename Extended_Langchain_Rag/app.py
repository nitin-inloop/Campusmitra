from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from contextlib import asynccontextmanager
import asyncio
import logging
import json
import os
import shutil
from pathlib import Path
from Rag_Pipeline import RAGBOT

# Import new modular components
from schemas.mongodb import connect_to_mongo, close_mongo_connection
from routes.auth_routes import router as auth_router
from routes.file_routes import router as file_router
from routes.rag_routes import router as rag_router
from services.rag_service import rag_service
from middleware.rate_limiter import RateLimitMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to store RAG components
rag_chain = None
is_initialized = False
vector_store = None
embeddings = None
collection_name = None
connection_string = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize RAG system and MongoDB on startup"""
    global rag_chain, is_initialized, vector_store, embeddings, collection_name, connection_string
    
    try:
        logger.info("Initializing application...")
        
        # Connect to MongoDB
        logger.info("Connecting to MongoDB...")
        mongodb_connected = await connect_to_mongo()
        if not mongodb_connected:
            logger.error("Failed to connect to MongoDB")
        else:
            logger.info("MongoDB connected successfully")
        
        # Initialize RAG system
        logger.info("Initializing RAG system...")
        
        # Initialize models (this can take 30-60 seconds for large models)
        logger.info("Loading AI models...")
        logger.info("  - Embedding: Gemini gemini-embedding-001 (API, no download)")
        llm, embeddings = RAGBOT.initialize_models()
        logger.info("  ✅ Models loaded successfully")
        
        # Setup database and vector store
        logger.info("Setting up vector database connection...")
        vector_store, collection_name, connection_string = RAGBOT.setup_database_and_vector_store(embeddings)
        
        if not vector_store:
            logger.error("Failed to initialize vector store")
            logger.warning("Server will start but RAG functionality will be unavailable")
            is_initialized = False
        else:
            # Load and embed documents
            logger.info("Loading and embedding documents from PDFs directory...")
            pdf_directory = "e:\\Programming\\Artifical_intelligence\\CampusMitra\\Extended_Langchain_Rag\\PDFs"
            vector_store = RAGBOT.load_and_embed_documents(vector_store, collection_name, pdf_directory, connection_string, embeddings)
            
            # Create RAG chain
            logger.info("Creating RAG chain...")
            rag_chain = RAGBOT.create_rag_chain(vector_store, llm)
            
            # Initialize RAG service with already-loaded models (avoid duplicate loading)
            logger.info("Initializing RAG service...")
            await rag_service.initialize_global_components_with_models(llm, embeddings, connection_string)
            
            is_initialized = True
            logger.info("RAG system initialized successfully!")
        
    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        is_initialized = False
    
    yield  # Server is running
    
    # Cleanup on shutdown
    logger.info("Shutting down application...")
    await close_mongo_connection()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="Campus Mitra RAG API",
    description="API for Campus Mitra RAG-based question answering system",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware to prevent abuse
app.add_middleware(RateLimitMiddleware)

# Include routers for modular functionality
app.include_router(auth_router)
app.include_router(file_router)
app.include_router(rag_router)

# Response models for health check endpoints
class HealthResponse(BaseModel):
    status: str
    message: str
    initialized: bool
    mongodb_connected: bool = False

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    # Check MongoDB connection
    mongodb_status = False
    try:
        from schemas.mongodb import mongodb
        if mongodb.database is not None:
            await mongodb.client.admin.command('ismaster')
            mongodb_status = True
    except:
        pass
        
    return HealthResponse(
        status="ok",
        message="Campus Mitra RAG API is running",
        initialized=is_initialized,
        mongodb_connected=mongodb_status
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    # Check MongoDB connection
    mongodb_status = False
    try:
        from schemas.mongodb import mongodb
        if mongodb.database is not None:
            await mongodb.client.admin.command('ismaster')
            mongodb_status = True
    except:
        pass
        
    return HealthResponse(
        status="healthy" if is_initialized else "initializing",
        message="RAG system is ready" if is_initialized else "RAG system is still initializing",
        initialized=is_initialized,
        mongodb_connected=mongodb_status
    )

# ============================================================================
# Legacy endpoints have been removed and replaced with modular endpoints:
# - POST /ask          -> POST /rag/ask (with authentication)
# - POST /ask-sync     -> POST /rag/ask (with authentication)
# - POST /ask-stream   -> POST /rag/ask-stream (with authentication)
# - POST /upload-pdf   -> POST /files/upload (with authentication)
# - GET /list-pdfs     -> GET /files/my-files (with authentication)
# - DELETE /delete-pdf -> DELETE /files/{file_id} (with authentication)
#
# See OLD_ENDPOINTS_REFERENCE.md for documentation and migration guide
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    # Use import string format for reload to work properly
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)