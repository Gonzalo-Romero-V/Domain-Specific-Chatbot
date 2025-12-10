"""
STEP 5 — Motor de recuperación
Responsabilidades:
- Generar embedding de la query
- Consultar ChromaDB
- Filtrar por distancia
- Retornar chunks con metadata
"""

from chromadb import PersistentClient
from pathlib import Path
from openai import OpenAI
from config import EMBEDDING_MODEL

# =============================
# INIT
# =============================

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
CHROMA_DIR = DATA_DIR / "04_store_chroma_db_output"

client_chroma = PersistentClient(path=str(CHROMA_DIR))
collection = client_chroma.get_collection("fundamentos_ia")

from utils import get_openai_client
client_openai = get_openai_client()

# =============================
# EMBEDDINGS
# =============================

def embed_query(query: str):
    """Genera embedding de la query usando el modelo definido en config."""
    response = client_openai.embeddings.create(
        model=EMBEDDING_MODEL,
        input=query
    )
    return response.data[0].embedding


# =============================
# RETRIEVE
# =============================

def retrieve(query: str, n_results: int, distance_threshold: float):
    """
    Recupera los chunks más relevantes filtrados por distancia.
    Los parámetros SIEMPRE vienen desde rag_query().
    """

    query_emb = embed_query(query)

    raw = collection.query(
        query_embeddings=[query_emb],
        n_results=n_results,
        include=["documents", "distances", "metadatas"]
    )

    docs = raw["documents"][0]
    dists = raw["distances"][0]
    metas = raw["metadatas"][0]

    # Filtrar y estructurar
    filtered = []
    for doc, dist, meta in zip(docs, dists, metas):
        if dist <= distance_threshold:
            filtered.append({
                "document": doc,
                "distance": float(dist),
                "metadata": meta
            })

    return filtered
