

import json
from chromadb import PersistentClient
from pathlib import Path
from openai import OpenAI


# =========================
# CONFIG
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
CHROMA_DIR = DATA_DIR / "04_store_chroma_db_output"

# =========================
# INIT CLIENTS
# =========================

client_chroma = PersistentClient(path=str(CHROMA_DIR))
collection = client_chroma.get_collection("fundamentos_ia")

from utils import get_openai_client
client_openai = get_openai_client()



# =========================
# SIMULACIÓN DE GUI INPUT
# =========================
default_query = "Sistemas  Expertos  Mejorados:  Los  sistemas  expertos  tradicionales,  basados  en conocimiento   simbólico   y   reglas,   se   pueden   enriquecer   con   técnicas   de aprendizaje  automático  para  manejar  la  incertidumbre, aprender patrones  y capturen excepciones almanejargrandes volúmenes de datos"
print(f"Pregunta por defecto: {default_query}")
user_input = input("Ingresa tu pregunta (o presiona Enter para usar la por defecto): ")

user_query = user_input.strip()
if not user_query:
    user_query = default_query

print(f"\n🔎 Buscando respuesta para: '{user_query}'...")

# =========================
# 1) Embedding de la pregunta
# =========================
query_emb = client_openai.embeddings.create(
    model="text-embedding-3-large",
    input=user_query
).data[0].embedding

# =========================
# 2) Búsqueda vectorial
# =========================
results = collection.query(
    query_embeddings=[query_emb],
    n_results=5
)

# =========================
# 3) Mostrar resultados
# =========================
print("\n📌 Textos relevantes obtenidos de la base vectorial:\n")

for i, doc in enumerate(results["documents"][0]):
    print(f"--- Resultado #{i+1} ---")
    print(doc)
    print()

print("Fin.\n")
