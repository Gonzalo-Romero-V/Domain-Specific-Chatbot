"""
Servicio RAG que encapsula el pipeline existente
"""

import sys
import importlib.util
from pathlib import Path

# Agregar el directorio pipeline al path para imports relativos
# Estructura: backend/api/services/rag_service.py
# Necesitamos: backend/pipeline/
BASE_DIR = Path(__file__).resolve().parents[2]  # backend/
PIPELINE_DIR = BASE_DIR / "pipeline"
sys.path.insert(0, str(PIPELINE_DIR))

# Importar módulo usando importlib para manejar nombres con números
rag_module_path = PIPELINE_DIR / "06_rag_response.py"
spec = importlib.util.spec_from_file_location("rag_response", rag_module_path)
rag_module = importlib.util.module_from_spec(spec)
sys.modules["rag_response"] = rag_module
spec.loader.exec_module(rag_module)

pipeline_run_rag = rag_module.run_rag
rag_query = rag_module.rag_query


def run_rag(query: str) -> str:
    """
    Ejecuta el pipeline RAG y retorna la respuesta.
    
    Args:
        query: Pregunta del usuario
        
    Returns:
        str: Respuesta generada por el LLM
        
    Raises:
        Exception: Si hay error en el pipeline
    """
    try:
        return pipeline_run_rag(query)
    except Exception as e:
        raise Exception(f"Error ejecutando RAG: {str(e)}")


def run_rag_with_chunks(query: str) -> dict:
    """
    Ejecuta el pipeline RAG y retorna respuesta con chunks.
    
    Args:
        query: Pregunta del usuario
        
    Returns:
        dict: Dict con 'respuesta', 'query' y 'chunks'
        
    Raises:
        Exception: Si hay error en el pipeline
    """
    try:
        resultado = rag_query(query=query, mode="full")
        return {
            "response": resultado.get("respuesta", ""),
            "query": resultado.get("query", query),
            "chunks": resultado.get("chunks", [])
        }
    except Exception as e:
        raise Exception(f"Error ejecutando RAG: {str(e)}")

