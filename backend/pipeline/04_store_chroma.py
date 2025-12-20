import json
from chromadb import PersistentClient
from chromadb.errors import NotFoundError
from pathlib import Path

# =========================
# CONFIG
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
EMBED_FILE = DATA_DIR / "03_embedding_output.jsonl"
CHROMA_DIR = DATA_DIR / "04_store_chroma_db_output"

# =========================
# INIT CLIENT
# =========================
print("📌 Inicializando cliente persistente de Chroma...")
client = PersistentClient(path=str(CHROMA_DIR))

# =========================
# GET OR CREATE COLLECTION
# =========================
collection_name = "fundamentos_ia"

# 1. Intentar borrar si existe
try:
    client.delete_collection(name=collection_name)
    print(f"🗑️ Colección '{collection_name}' eliminada (limpieza previa).")
except NotFoundError:
    print(f"ℹ️ La colección '{collection_name}' no existía, seguimos...")

# 2. Crear nueva
print("🆕 Creando nueva colección...")
collection = client.create_collection(name=collection_name, metadata={"hnsw:space": "cosine"})

# =========================
# LOAD EMBEDDINGS
# =========================
embeddings = []
with open(EMBED_FILE, "r", encoding="utf-8") as f:
    for line in f:
        record = json.loads(line)

        if "embedding" not in record: raise ValueError("❗ Falta 'embedding'")
        if "text" not in record: raise ValueError("❗ Falta 'text'")
        if "id" not in record: raise ValueError("❗ Falta 'id'")

        if "metadata" not in record or not record["metadata"]:
            record["metadata"] = {"source": "fundamentos_ia"}

        embeddings.append(record)

print(f"📦 Cargando {len(embeddings)} embeddings en Chroma...")

# =========================
# INSERT INTO COLLECTION
# =========================
collection.add(
    ids=[e["id"] for e in embeddings],
    embeddings=[e["embedding"] for e in embeddings],
    documents=[e["text"] for e in embeddings],
    metadatas=[e["metadata"] for e in embeddings]
)

print("✅ Vector DB guardada correctamente")

