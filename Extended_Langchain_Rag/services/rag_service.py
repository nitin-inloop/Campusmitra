import os
import sys
from typing import Optional
from pathlib import Path
from Rag_Pipeline import RAGBOT
from schemas.file_schema import FileStatus
from services.file_service import update_file_status
import logging

logger = logging.getLogger(__name__)

class UserRAGService:
    """Service for managing user-specific RAG operations"""
    
    def __init__(self):
        self.user_rag_chains = {}  # Cache for user-specific RAG chains
        self.global_embeddings = None
        self.global_connection_string = None
        self.global_llm = None
    
    async def initialize_global_components(self):
        """Initialize global RAG components (LLM, embeddings, connection) - lazy initialization"""
        if self.global_llm is None or self.global_embeddings is None:
            try:
                logger.info("Initializing global RAG components (lazy load)...")
                
                # Initialize models using existing RAGBOT methods
                self.global_llm, self.global_embeddings = RAGBOT.initialize_models()
                
                # Get connection string from existing setup
                _, _, self.global_connection_string = RAGBOT.setup_database_and_vector_store(
                    self.global_embeddings
                )
                
                logger.info("Global RAG components initialized successfully")
                
            except Exception as e:
                logger.error(f"Failed to initialize global RAG components: {e}")
                raise
    
    async def initialize_global_components_with_models(self, llm, embeddings, connection_string):
        """Initialize global RAG components with pre-loaded models (avoids duplicate loading)"""
        try:
            logger.info("Setting up RAG service with pre-loaded models...")
            self.global_llm = llm
            self.global_embeddings = embeddings
            self.global_connection_string = connection_string
            logger.info("RAG service initialized with shared models")
        except Exception as e:
            logger.error(f"Failed to initialize RAG service: {e}")
            raise
    
    async def process_user_file(self, file_path: str, user_id: str, file_id: str):
        """Process a file for user-specific vector collection"""
        try:
            await self.initialize_global_components()
            
            logger.info(f"Processing file {file_path} for user {user_id}")
            
            # Update file status to processing
            await update_file_status(file_id, FileStatus.PROCESSING, embedding_status="processing")
            
            # Create user-specific collection name
            collection_name = f"user_{user_id}_embeddings"
            
            # Create user-specific vector store
            from langchain_postgres.vectorstores import PGVector
            from langchain_community.document_loaders import PyMuPDFLoader
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            from langchain_core.documents import Document
            
            user_vector_store = PGVector(
                embeddings=self.global_embeddings,
                connection=self.global_connection_string,
                collection_name=collection_name,
                use_jsonb=True
            )
            
            # Load the specific PDF file
            logger.info(f"Loading PDF: {file_path}")
            loader = PyMuPDFLoader(file_path)
            documents = loader.load()
            
            # Add source metadata
            for doc in documents:
                doc.metadata["source"] = os.path.basename(file_path)
                doc.metadata["user_id"] = user_id
            
            logger.info(f"Loaded {len(documents)} pages from PDF")
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", " ", ""],
            )
            splits = text_splitter.split_documents(documents)
            
            logger.info(f"Split into {len(splits)} chunks")
            
            # Add instruction prefix for the embedding model (multilingual-e5)
            docs_to_embed = [
                Document(
                    page_content=f"Represent this document for semantic search: {doc.page_content}",
                    metadata=doc.metadata,
                ) for doc in splits
            ]
            
            # Add documents to vector store
            logger.info(f"Adding {len(docs_to_embed)} chunks to vector store...")
            user_vector_store.add_documents(docs_to_embed)
            
            logger.info(f"Successfully added chunks to collection {collection_name}")
            
            # Update file status to ready
            await update_file_status(
                file_id, 
                FileStatus.READY, 
                embedding_status="completed",
                chunks_count=len(splits)
            )
            
            # Clear cached RAG chain for this user so it gets recreated
            if user_id in self.user_rag_chains:
                del self.user_rag_chains[user_id]
            
            logger.info(f"File processed successfully for user {user_id}: {len(splits)} chunks created")
            
        except Exception as e:
            logger.error(f"Error processing file for user {user_id}: {e}")
            # Update file status to error
            await update_file_status(file_id, FileStatus.ERROR, embedding_status="failed")
            raise
    
    async def create_user_rag_chain(self, user_id: str):
        """Create or get cached user-specific RAG chain"""
        if user_id in self.user_rag_chains:
            return self.user_rag_chains[user_id]
        
        try:
            await self.initialize_global_components()
            
            # Create user-specific collection name
            collection_name = f"user_{user_id}_embeddings"
            
            # Create user-specific vector store
            from langchain_postgres.vectorstores import PGVector
            
            user_vector_store = PGVector(
                embeddings=self.global_embeddings,
                connection=self.global_connection_string,
                collection_name=collection_name,
                use_jsonb=True
            )
            
            # Create RAG chain using existing RAGBOT method
            rag_chain = RAGBOT.create_rag_chain(user_vector_store, self.global_llm)
            
            # Cache the RAG chain
            self.user_rag_chains[user_id] = rag_chain
            
            return rag_chain
            
        except Exception as e:
            logger.error(f"Error creating RAG chain for user {user_id}: {e}")
            raise
    
    async def query_user_documents(self, user_id: str, question: str) -> str:
        """Query user's documents with a question"""
        try:
            # Get or create user-specific RAG chain
            rag_chain = await self.create_user_rag_chain(user_id)
            
            # Query the documents
            response = rag_chain.invoke(question)
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"Error querying documents for user {user_id}: {e}")
            raise
    
    async def query_user_documents_stream(self, user_id: str, question: str):
        """Query user's documents with streaming response"""
        try:
            # Get or create user-specific RAG chain
            rag_chain = await self.create_user_rag_chain(user_id)
            
            # Stream the response
            for chunk in rag_chain.stream(question):
                yield chunk
                
        except Exception as e:
            logger.error(f"Error streaming query for user {user_id}: {e}")
            raise
    
    async def delete_user_collection(self, user_id: str):
        """Delete user's vector collection when user is deleted"""
        try:
            await self.initialize_global_components()
            
            collection_name = f"user_{user_id}_embeddings"
            
            # Delete from vector database
            from sqlalchemy import create_engine, text
            engine = create_engine(self.global_connection_string)
            
            with engine.connect() as conn:
                # Delete all documents from user's collection
                conn.execute(
                    text(f"DELETE FROM langchain_pg_embedding WHERE collection_id = (SELECT uuid FROM langchain_pg_collection WHERE name = :collection_name)"),
                    {"collection_name": collection_name}
                )
                
                # Delete the collection itself
                conn.execute(
                    text("DELETE FROM langchain_pg_collection WHERE name = :collection_name"),
                    {"collection_name": collection_name}
                )
                
                conn.commit()
            
            # Remove from cache
            if user_id in self.user_rag_chains:
                del self.user_rag_chains[user_id]
                
            logger.info(f"Deleted vector collection for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error deleting collection for user {user_id}: {e}")
            # Don't raise error as this is cleanup operation

# Global instance
rag_service = UserRAGService()