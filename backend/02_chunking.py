def chunk_by_paragraphs(text):
    """
    Divide el texto en chunks usando los saltos de línea dobles como separadores de párrafos.
    Limpia espacios extra y omite párrafos vacíos o muy cortos.
    """
    # Dividimos por saltos de línea dobles (\n\n), que generalmente separan párrafos
    raw_paragraphs = text.split('\n\n')
    
    chunks = []
    for para in raw_paragraphs:
        # Limpiamos espacios extra al inicio y final
        cleaned_para = para.strip()
        
        # Omitimos párrafos vacíos o demasiado cortos (menos de 10 palabras)
        if len(cleaned_para) > 0 and len(cleaned_para.split()) >= 10:
            chunks.append(cleaned_para)
    
    return chunks

import os

# --- Configuración de rutas ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
INPUT_FILE = os.path.join(DATA_DIR, "extraction_output.txt")
OUTPUT_FILE = os.path.join(DATA_DIR, "chunking_output.json")

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


# --- Fragmentar por párrafos ---
print("\nDividiendo el texto por párrafos...")
chunks = chunk_by_paragraphs(full_text)
print(f"✅ Se crearon {len(chunks)} chunks (párrafos válidos).")


# --- Mostrar ejemplo de los primeros 3 párrafos ---
print("\n--- Ejemplo de los primeros 3 párrafos extraídos ---")
for i in range(min(3, len(chunks))):
    word_count = len(chunks[i].split())
    print(f"\n🔹 Párrafo {i+1} ({word_count} palabras):\n\"{chunks[i][:400]}...\"")


# --- Guardar los chunks en formato JSON ---
import json

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)

print(f"\n✅ Chunks guardados en '{OUTPUT_FILE}'")