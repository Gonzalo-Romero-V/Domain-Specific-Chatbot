"""
FastAPI Application Principal
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.config import CORS_ORIGINS, API_PREFIX
from api.db.client import get_database, close_connection
from api.routers import chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events: inicializar y cerrar conexiones
    """
    # Startup: inicializar MongoDB
    print("🚀 Iniciando aplicación...")
    try:
        get_database()
        print("✅ MongoDB inicializado")
    except Exception as e:
        print(f"⚠️  Advertencia: No se pudo conectar a MongoDB: {e}")
        print("   La aplicación continuará, pero algunas funciones pueden no funcionar")
    
    yield
    
    # Shutdown: cerrar conexiones
    print("🛑 Cerrando aplicación...")
    close_connection()


# Crear aplicación FastAPI
app = FastAPI(
    title="RAG Chatbot API",
    description="API para el chatbot RAG especializado en Fundamentos de IA",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(chat.router, prefix=API_PREFIX, tags=["chat"])


# =============================
# ENDPOINTS BÁSICOS
# =============================

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "RAG Chatbot API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """
    Endpoint de salud para verificar que la API está funcionando.
    """
    try:
        # Verificar conexión a MongoDB
        db = get_database()
        db.admin.command('ping')
        mongo_status = "connected"
    except Exception:
        mongo_status = "disconnected"
    
    return {
        "status": "ok",
        "mongodb": mongo_status
    }

