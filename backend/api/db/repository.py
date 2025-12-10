"""
Repository para operaciones CRUD en MongoDB
- Usuarios
- Conversaciones
- Mensajes
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from bson import ObjectId

from api.db.client import get_database


class Repository:
    """Clase para operaciones CRUD en MongoDB"""
    
    def __init__(self):
        self.db = get_database()
        self.users_collection = self.db["users"]
        self.conversations_collection = self.db["conversations"]
        self.messages_collection = self.db["messages"]
    
    # =============================
    # USUARIOS
    # =============================
    
    def create_user(self, username: str, email: str) -> str:
        """
        Crea un nuevo usuario.
        
        Args:
            username: Nombre de usuario
            email: Email del usuario
            
        Returns:
            str: ID del usuario creado
        """
        user_doc = {
            "username": username,
            "email": email,
            "created_at": datetime.utcnow()
        }
        result = self.users_collection.insert_one(user_doc)
        return str(result.inserted_id)
    
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por ID.
        
        Args:
            user_id: ID del usuario
            
        Returns:
            Dict con datos del usuario o None si no existe
        """
        try:
            user = self.users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
            return user
        except Exception:
            return None
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por email.
        
        Args:
            email: Email del usuario
            
        Returns:
            Dict con datos del usuario o None si no existe
        """
        user = self.users_collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    # =============================
    # CONVERSACIONES
    # =============================
    
    def create_conversation(self, user_id: str, title: Optional[str] = None) -> str:
        """
        Crea una nueva conversación.
        
        Args:
            user_id: ID del usuario propietario
            title: Título opcional de la conversación
            
        Returns:
            str: ID de la conversación creada
        """
        if title is None:
            title = "Nueva conversación"
        
        conversation_doc = {
            "user_id": user_id,
            "title": title,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.conversations_collection.insert_one(conversation_doc)
        return str(result.inserted_id)
    
    def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene una conversación por ID.
        
        Args:
            conversation_id: ID de la conversación
            
        Returns:
            Dict con datos de la conversación o None si no existe
        """
        try:
            conversation = self.conversations_collection.find_one(
                {"_id": ObjectId(conversation_id)}
            )
            if conversation:
                conversation["_id"] = str(conversation["_id"])
            return conversation
        except Exception:
            return None
    
    def get_user_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Obtiene todas las conversaciones de un usuario.
        
        Args:
            user_id: ID del usuario
            
        Returns:
            Lista de conversaciones ordenadas por fecha de actualización descendente
        """
        conversations = list(
            self.conversations_collection.find({"user_id": user_id})
            .sort("updated_at", -1)
        )
        for conv in conversations:
            conv["_id"] = str(conv["_id"])
        return conversations
    
    def update_conversation_title(self, conversation_id: str, title: str) -> bool:
        """
        Actualiza el título de una conversación.
        
        Args:
            conversation_id: ID de la conversación
            title: Nuevo título
            
        Returns:
            True si se actualizó, False si no existe
        """
        try:
            result = self.conversations_collection.update_one(
                {"_id": ObjectId(conversation_id)},
                {
                    "$set": {
                        "title": title,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception:
            return False
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """
        Elimina una conversación y todos sus mensajes asociados (cascada).
        
        Args:
            conversation_id: ID de la conversación
            
        Returns:
            True si se eliminó, False si no existe o hubo error
        """
        try:
            # Verificar que la conversación existe
            conversation = self.conversations_collection.find_one(
                {"_id": ObjectId(conversation_id)}
            )
            if not conversation:
                return False
            
            # Eliminar todos los mensajes asociados (cascada)
            self.messages_collection.delete_many({"conversation_id": conversation_id})
            
            # Eliminar la conversación
            result = self.conversations_collection.delete_one(
                {"_id": ObjectId(conversation_id)}
            )
            
            return result.deleted_count > 0
        except Exception:
            return False
    
    # =============================
    # MENSAJES
    # =============================
    
    def save_message(
        self,
        conversation_id: str,
        role: str,
        content: str
    ) -> str:
        """
        Guarda un mensaje en una conversación.
        
        Args:
            conversation_id: ID de la conversación
            role: Rol del mensaje ('user' o 'assistant')
            content: Contenido del mensaje
            
        Returns:
            str: ID del mensaje guardado
        """
        message_doc = {
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "created_at": datetime.utcnow()
        }
        result = self.messages_collection.insert_one(message_doc)
        
        # Actualizar updated_at de la conversación
        try:
            self.conversations_collection.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$set": {"updated_at": datetime.utcnow()}}
            )
        except Exception:
            pass  # No crítico si falla
        
        return str(result.inserted_id)
    
    def get_conversation_messages(
        self,
        conversation_id: str
    ) -> List[Dict[str, Any]]:
        """
        Obtiene todos los mensajes de una conversación.
        
        Args:
            conversation_id: ID de la conversación
            
        Returns:
            Lista de mensajes ordenados por fecha de creación ascendente
        """
        messages = list(
            self.messages_collection.find({"conversation_id": conversation_id})
            .sort("created_at", 1)
        )
        for msg in messages:
            msg["_id"] = str(msg["_id"])
        return messages

