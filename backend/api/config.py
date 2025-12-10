"""
Configuración de la API FastAPI
- CORS para Next.js
- MongoDB local
- Variables de entorno
"""

import os
from typing import List

# CORS Configuration
CORS_ORIGINS: List[str] = [
    "http://localhost:3000",  # Next.js default port
    "http://127.0.0.1:3000",
]

# MongoDB Configuration
MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "rag_chatbot")

# API Configuration
API_PREFIX: str = "/api"

