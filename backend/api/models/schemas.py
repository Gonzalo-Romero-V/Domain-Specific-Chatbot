"""
Modelos Pydantic para requests y responses de la API
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# =============================
# USUARIOS
# =============================

class UserCreate(BaseModel):
    """Request para crear usuario"""
    username: str
    email: EmailStr


class UserResponse(BaseModel):
    """Response de usuario"""
    id: str
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# =============================
# CONVERSACIONES
# =============================

class ConversationCreate(BaseModel):
    """Request para crear conversación"""
    user_id: str
    title: Optional[str] = None


class ConversationResponse(BaseModel):
    """Response de conversación"""
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# =============================
# MENSAJES
# =============================

class MessageCreate(BaseModel):
    """Request para crear mensaje"""
    conversation_id: str
    role: str  # 'user' o 'assistant'
    content: str


class MessageResponse(BaseModel):
    """Response de mensaje"""
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# =============================
# RAG
# =============================

class RAGRequest(BaseModel):
    """Request para consulta RAG"""
    query: str
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None


class ChunkResponse(BaseModel):
    """Response de chunk recuperado"""
    document: str
    distance: float
    metadata: Optional[dict] = None


class RAGResponse(BaseModel):
    """Response de consulta RAG"""
    response: str
    query: str
    chunks: Optional[List[ChunkResponse]] = None

