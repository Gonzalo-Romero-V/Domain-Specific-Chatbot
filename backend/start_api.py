"""
Script para iniciar el servidor FastAPI
Ejecutar desde la raíz del proyecto: python backend/start_api.py
"""

import uvicorn
import sys
from pathlib import Path

# Agregar el directorio backend al path para imports
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload en desarrollo
        reload_dirs=["backend/api", "backend/pipeline"]
    )

