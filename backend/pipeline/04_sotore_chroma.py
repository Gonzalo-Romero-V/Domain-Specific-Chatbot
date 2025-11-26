import json
from chromadb import PersistentClient
from pathlib import Path

# =========================
# CONFIG
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
EMBED_FILE = DATA_DIR / "embedding_output.jsonl"
CHROMA_DIR = DATA_DIR / "store_chroma_db_output"

# =========================
# INIT CLIENT
# =========================
print("📌 Inicializando cliente persistente de Chroma...")
client = PersistentClient(path=str(CHROMA_DIR))

# =========================
# GET OR CREATE COLLECTION
# =========================
collection_name = "fundamentos_ia"

exists = False
for col in client.list_collections():
    if col.name == collection_name:
        exists = True
        break

if not exists:
    print("🆕 Creando nueva colección...")
    collection = client.create_collection(name=collection_name, metadata={"hnsw:space": "cosine"})
else:
    print("ℹ️ Reutilizando colección existente...")
    collection = client.get_collection(name=collection_name)

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

        # Ajuste importante:
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
