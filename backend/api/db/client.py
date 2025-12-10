"""
Cliente MongoDB para la conexión a la base de datos
"""

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import sys

from api.config import MONGODB_URL, MONGODB_DB_NAME

_client: MongoClient = None
_database: Database = None


def get_database() -> Database:
    """
    Obtiene la instancia de la base de datos MongoDB.
    Crea la conexión si no existe.
    
    Returns:
        Database: Instancia de la base de datos MongoDB
        
    Raises:
        ConnectionFailure: Si no se puede conectar a MongoDB
    """
    global _client, _database
    
    if _database is not None:
        return _database
    
    try:
        _client = MongoClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 segundos timeout
        )
        # Verificar conexión
        _client.admin.command('ping')
        _database = _client[MONGODB_DB_NAME]
        print(f"✅ Conectado a MongoDB: {MONGODB_DB_NAME}")
        return _database
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"❌ Error conectando a MongoDB: {e}")
        print(f"   URL: {MONGODB_URL}")
        print(f"   Asegúrate de que MongoDB esté corriendo localmente")
        sys.exit(1)


def close_connection():
    """Cierra la conexión a MongoDB"""
    global _client, _database
    if _client is not None:
        _client.close()
        _client = None
        _database = None
        print("🔌 Conexión a MongoDB cerrada")

