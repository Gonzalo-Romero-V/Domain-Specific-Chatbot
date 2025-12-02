import os
import re
import json
from pathlib import Path

# ------------------ LIMPIEZA DEL TEXTO ------------------
def limpiar_texto(texto):
    """
    Limpia el texto eliminando títulos, encabezados, números de página
    y normalizando espacios.
    """
    # Eliminar títulos tipo "CAPÍTULO 1", "CAPITULO I", "CAP. 2"
    texto = re.sub(r"\bCAP(ÍTULO|ITULO|)\s+\w+\b", "", texto, flags=re.IGNORECASE)

    # Eliminar líneas completas en MAYÚSCULAS
    texto = re.sub(r"\n[A-ZÁÉÍÓÚÑ0-9 ,.'’\\-]{4,80}\n", "\n", texto)

    # Eliminar números de página aislados
    texto = re.sub(r"\n?\s*\b\d{1,4}\b\s*\n?", " ", texto)

    # Eliminar múltiples saltos de línea
    texto = re.sub(r"\n+", " ", texto)

    # Compactar espacios
    texto = re.sub(r"\s+", " ", texto)

    return texto.strip()


# ------------------ CHUNKING ------------------
def chunk_by_sliding_window(text, chunk_size_words=180, overlap=60):
    """
    Divide el texto en chunks solapados por ventana móvil.
    """
    words = [w for w in text.replace('\n', ' ').split() if w.strip()]
    if not words:
        return []

    step = max(1, chunk_size_words - overlap)
    chunks = []

    for start in range(0, max(1, len(words) - 1), step):
        end = start + chunk_size_words
        chunk_words = words[start:end]

        if not chunk_words:
            break

        chunk_text = ' '.join(chunk_words).strip()

        # Solo agregar chunk si tiene suficientes palabras
        if len(chunk_text.split()) >= int(chunk_size_words * 0.4):
            chunks.append(chunk_text)

        if end >= len(words):
            break

    return chunks


# --- Configuración de rutas ---
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
INPUT_FILE = DATA_DIR / "01_extraction_output.txt"
OUTPUT_FILE = DATA_DIR / "02_chunking_output.json"


# --- Cargar el texto extraído ---
try:
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        full_text = f.read()
    print(f"✅ Texto cargado desde '{INPUT_FILE}'")
    print(f"Total de caracteres: {len(full_text)}")
    print(f"Total de palabras: {len(full_text.split())}")

except FileNotFoundError:
    print(f"❌ No se encontró el archivo '{INPUT_FILE}'.")
    print("Asegúrate de haber ejecutado primero '01_extraction.py'.")
    exit()


# --- LIMPIAR TEXTO ---
print("\nLimpiando texto...")
full_text = limpiar_texto(full_text)
print(f"✅ Texto limpiado correctamente. Total de palabras luego de limpieza: {len(full_text.split())}")


# --- CHUNKING POR SLIDING WINDOW ---
print("\nDividiendo el texto por ventana móvil...")
chunks = chunk_by_sliding_window(full_text, chunk_size_words=180, overlap=60)
print(f"✅ Se crearon {len(chunks)} chunks.")


# --- Mostrar ejemplo de los primeros 3 chunks ---
print("\n--- Ejemplo de los primeros 3 chunks ---")
for i in range(min(3, len(chunks))):
    word_count = len(chunks[i].split())
    print(f"\n🔹 Chunk {i+1} ({word_count} palabras):\n\"{chunks[i][:400]}...\"")


# --- Guardar los chunks en formato JSON ---
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)

print(f"\n📦 Chunks guardados en '{OUTPUT_FILE}'")
