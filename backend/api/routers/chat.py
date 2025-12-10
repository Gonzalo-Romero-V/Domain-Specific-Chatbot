"""
Endpoints REST para chat, usuarios, conversaciones y RAG
"""

from fastapi import APIRouter, HTTPException, status
from typing import List

from api.models.schemas import (
    UserCreate,
    UserResponse,
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
    RAGRequest,
    RAGResponse,
    ChunkResponse
)
from api.services import db_service
from api.services.rag_service import run_rag_with_chunks

router = APIRouter()


# =============================
# USUARIOS
# =============================

@router.post("/user", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate):
    """
    Crea un nuevo usuario.
    """
    try:
        # Verificar si el usuario ya existe
        existing_user = db_service.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        user_id = db_service.create_user(
            username=user_data.username,
            email=user_data.email
        )
        
        user = db_service.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear el usuario"
            )
        
        return UserResponse(
            id=user["_id"],
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario: {str(e)}"
        )


@router.get("/user/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """
    Obtiene un usuario por ID.
    """
    user = db_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(
        id=user["_id"],
        username=user["username"],
        email=user["email"],
        created_at=user["created_at"]
    )


@router.get("/user/by-email/{email}", response_model=UserResponse)
async def get_user_by_email(email: str):
    """
    Obtiene un usuario por email.
    """
    user = db_service.get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(
        id=user["_id"],
        username=user["username"],
        email=user["email"],
        created_at=user["created_at"]
    )


# =============================
# CONVERSACIONES
# =============================

@router.post("/conversation", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(conversation_data: ConversationCreate):
    """
    Crea una nueva conversación.
    """
    try:
        # Verificar que el usuario existe
        user = db_service.get_user(conversation_data.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        conversation_id = db_service.create_conversation(
            user_id=conversation_data.user_id,
            title=conversation_data.title
        )
        
        conversation = db_service.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear la conversación"
            )
        
        return ConversationResponse(
            id=conversation["_id"],
            user_id=conversation["user_id"],
            title=conversation["title"],
            created_at=conversation["created_at"],
            updated_at=conversation["updated_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear conversación: {str(e)}"
        )


@router.get("/conversation/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str):
    """
    Obtiene una conversación por ID.
    """
    conversation = db_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversación no encontrada"
        )
    
    return ConversationResponse(
        id=conversation["_id"],
        user_id=conversation["user_id"],
        title=conversation["title"],
        created_at=conversation["created_at"],
        updated_at=conversation["updated_at"]
    )


@router.get("/user/{user_id}/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(user_id: str):
    """
    Obtiene todas las conversaciones de un usuario.
    """
    # Verificar que el usuario existe
    user = db_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    conversations = db_service.get_user_conversations(user_id)
    return [
        ConversationResponse(
            id=conv["_id"],
            user_id=conv["user_id"],
            title=conv["title"],
            created_at=conv["created_at"],
            updated_at=conv["updated_at"]
        )
        for conv in conversations
    ]


@router.delete("/conversation/{conversation_id}", status_code=status.HTTP_200_OK)
async def delete_conversation(conversation_id: str):
    """
    Elimina una conversación y todos sus mensajes asociados.
    """
    try:
        # Verificar que la conversación existe
        conversation = db_service.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada"
            )
        
        # Eliminar conversación y mensajes
        success = db_service.delete_conversation(conversation_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar la conversación"
            )
        
        return {"message": "Conversación eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar conversación: {str(e)}"
        )


# =============================
# MENSAJES
# =============================

@router.post("/message", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def save_message(message_data: MessageCreate):
    """
    Guarda un mensaje en una conversación.
    """
    try:
        # Verificar que la conversación existe
        conversation = db_service.get_conversation(message_data.conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada"
            )
        
        # Validar role
        if message_data.role not in ["user", "assistant"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El role debe ser 'user' o 'assistant'"
            )
        
        message_id = db_service.save_message(
            conversation_id=message_data.conversation_id,
            role=message_data.role,
            content=message_data.content
        )
        
        message = db_service.get_conversation_messages(message_data.conversation_id)
        # Buscar el mensaje recién creado
        saved_message = None
        for msg in message:
            if msg["_id"] == message_id:
                saved_message = msg
                break
        
        if not saved_message:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al guardar el mensaje"
            )
        
        return MessageResponse(
            id=saved_message["_id"],
            conversation_id=saved_message["conversation_id"],
            role=saved_message["role"],
            content=saved_message["content"],
            created_at=saved_message["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al guardar mensaje: {str(e)}"
        )


@router.get("/conversation/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(conversation_id: str):
    """
    Obtiene todos los mensajes de una conversación.
    """
    # Verificar que la conversación existe
    conversation = db_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversación no encontrada"
        )
    
    messages = db_service.get_conversation_messages(conversation_id)
    return [
        MessageResponse(
            id=msg["_id"],
            conversation_id=msg["conversation_id"],
            role=msg["role"],
            content=msg["content"],
            created_at=msg["created_at"]
        )
        for msg in messages
    ]


# =============================
# RAG
# =============================

@router.post("/rag", response_model=RAGResponse)
async def query_rag(rag_request: RAGRequest):
    """
    Ejecuta el pipeline RAG para responder una pregunta.
    Si se proporciona conversation_id, guarda el mensaje del usuario y la respuesta.
    """
    try:
        # Ejecutar pipeline RAG
        resultado = run_rag_with_chunks(rag_request.query)
        
        # Si hay conversation_id, guardar mensajes
        if rag_request.conversation_id:
            # Verificar que la conversación existe
            conversation = db_service.get_conversation(rag_request.conversation_id)
            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversación no encontrada"
                )
            
            # Guardar mensaje del usuario
            db_service.save_message(
                conversation_id=rag_request.conversation_id,
                role="user",
                content=rag_request.query
            )
            
            # Guardar respuesta del assistant
            db_service.save_message(
                conversation_id=rag_request.conversation_id,
                role="assistant",
                content=resultado["response"]
            )
        
        # Formatear chunks para la respuesta
        chunks_response = None
        if resultado.get("chunks"):
            chunks_response = [
                ChunkResponse(
                    document=chunk["document"],
                    distance=chunk["distance"],
                    metadata=chunk.get("metadata")
                )
                for chunk in resultado["chunks"]
            ]
        
        return RAGResponse(
            response=resultado["response"],
            query=resultado["query"],
            chunks=chunks_response
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ejecutando RAG: {str(e)}"
        )

