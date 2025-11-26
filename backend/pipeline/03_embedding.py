"""
===============================================================
Embeddings Pipeline - Modular, Parametrizable y Legible
===============================================================
Este script genera embeddings a partir de chunks de texto usando
la API de OpenAI.

Características:
- Funciona con o sin metadatos
- Modelo parametrizable
- Procesamiento de múltiples chunks
- Salida en JSONL (estándar para vectores)
- Código limpio, claro y mantenible
"""

import json
import uuid
import os
from pathlib import Path
from typing import List, Dict, Any

from openai import OpenAI


# ===============================================================
# CONFIGURACIÓN GENERAL
# ===============================================================

# Definir rutas relativas al script para mayor robustez
# Script en: backend/pipeline/03_embedding.py
# parents[0] = pipeline, parents[1] = backend, parents[2] = root
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

CONFIG = {
    "openai": {
        "model": "text-embedding-3-large",  # cambiar aquí para experimentar
    },
    "paths": {
        "input_chunks": DATA_DIR / "chunking_output.json",
        "output_embeddings": DATA_DIR / "embedding_output.jsonl"
    }
}


# ===============================================================
# INICIALIZACIÓN DEL CLIENTE
# (La API key se toma automáticamente del entorno: .env o variables)
# ===============================================================

from utils import get_openai_client
client = get_openai_client()

# ===============================================================
# FUNCIÓN: crear un embedding para un chunk
# ===============================================================

def create_embedding(
    text: str,
    model: str = CONFIG["openai"]["model"]
) -> List[float]:
    """
    Envía un texto al modelo de embeddings de OpenAI
    y devuelve el vector resultante.

    Parámetros:
    - text: Texto limpio del chunk
    - model: Nombre del modelo (parametrizable)

    Retorna:
    - Lista de floats con el embedding
    """
    if not text.strip():
        raise ValueError("El texto del chunk está vacío o es inválido.")

    response = client.embeddings.create(
        model=model,
        input=text
    )

    return response.data[0].embedding


# ===============================================================
# FUNCIÓN: procesar un chunk estándar
# ===============================================================

def process_chunk(chunk: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recibe un chunk con estructura:
    {
      "id": "...",
      "text": "...",
      "metadata": {...}
    }

    Devuelve:
    {
      "id": "...",
      "text": "...",     # ← NECESARIO para CHROMA
      "embedding": [...],
      "metadata": {...}
    }
    """
    embedding = create_embedding(chunk["text"])

    return {
        "id": chunk["id"],
        "text": chunk["text"],     # ← NECESARIO para CHROMA
        "embedding": embedding,
        "metadata": chunk.get("metadata", {})
    }


# ===============================================================
# FUNCIÓN: procesar múltiples chunks
# ===============================================================

def process_chunk_list(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Procesa una lista completa de chunks y devuelve
    su lista de embeddings correspondientes.
    """
    results = []

    for index, chunk in enumerate(chunks, start=1):
        print(f"[{index}/{len(chunks)}] Embedding chunk {chunk['id']}...")

        embedded = process_chunk(chunk)
        results.append(embedded)

    return results


# ===============================================================
# FUNCIÓN: guardar embeddings en JSONL
# ===============================================================

def save_as_jsonl(
    embeddings: List[Dict[str, Any]],
    output_path: str
) -> None:
    """
    Exporta los embeddings en formato JSONL.
    Cada línea = un vector con metadatos.
    """
    with open(output_path, "w", encoding="utf-8") as f:
        for row in embeddings:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"Embeddings guardados en: {output_path}")


# ===============================================================
# EJECUCIÓN PRINCIPAL (solo si se llama directamente)
# ===============================================================

def main():
    """
    Pipeline completo:
    1. Cargar chunks
    2. Normalizar su estructura (asegurar IDs)
    3. Generar embeddings
    4. Guardar resultados
    """

    input_path = CONFIG["paths"]["input_chunks"]
    output_path = CONFIG["paths"]["output_embeddings"]

    print(f"Cargando chunks desde: {input_path}")

    with open(input_path, "r", encoding="utf-8") as f:
        raw_chunks: List[str] = json.load(f)

    # Convertir texto simple a formato estándar
    chunks = []
    for text in raw_chunks:
        chunks.append({
            "id": str(uuid.uuid4()),
            "text": text,
            "metadata": {}  # opcional
        })

    print(f"Total de chunks: {len(chunks)}")

    embeddings = process_chunk_list(chunks)

    save_as_jsonl(embeddings, output_path)

    print("\nProceso completado ✓")


# ===============================================================
# PUNTO DE ENTRADA
# ===============================================================
if __name__ == "__main__":
    main()
