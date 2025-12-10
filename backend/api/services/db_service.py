"""
Servicio de base de datos - Wrapper del repository
"""

from typing import Optional, List, Dict, Any
from api.db.repository import Repository

# Instancia singleton del repository
_repository: Optional[Repository] = None


def get_repository() -> Repository:
    """Obtiene la instancia del repository (singleton)"""
    global _repository
    if _repository is None:
        _repository = Repository()
    return _repository


# =============================
# USUARIOS
# =============================

def create_user(username: str, email: str) -> str:
    """Crea un nuevo usuario"""
    repo = get_repository()
    return repo.create_user(username, email)


def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Obtiene un usuario por ID"""
    repo = get_repository()
    return repo.get_user(user_id)


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Obtiene un usuario por email"""
    repo = get_repository()
    return repo.get_user_by_email(email)


# =============================
# CONVERSACIONES
# =============================

def create_conversation(user_id: str, title: Optional[str] = None) -> str:
    """Crea una nueva conversación"""
    repo = get_repository()
    return repo.create_conversation(user_id, title)


def get_conversation(conversation_id: str) -> Optional[Dict[str, Any]]:
    """Obtiene una conversación por ID"""
    repo = get_repository()
    return repo.get_conversation(conversation_id)


def get_user_conversations(user_id: str) -> List[Dict[str, Any]]:
    """Obtiene todas las conversaciones de un usuario"""
    repo = get_repository()
    return repo.get_user_conversations(user_id)


def delete_conversation(conversation_id: str) -> bool:
    """Elimina una conversación y todos sus mensajes asociados"""
    repo = get_repository()
    return repo.delete_conversation(conversation_id)


# =============================
# MENSAJES
# =============================

def save_message(conversation_id: str, role: str, content: str) -> str:
    """Guarda un mensaje en una conversación"""
    repo = get_repository()
    return repo.save_message(conversation_id, role, content)


def get_conversation_messages(conversation_id: str) -> List[Dict[str, Any]]:
    """Obtiene todos los mensajes de una conversación"""
    repo = get_repository()
    return repo.get_conversation_messages(conversation_id)

