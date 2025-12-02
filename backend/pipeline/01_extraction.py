import fitz  # PyMuPDF
import os
from pathlib import Path

def extract_text_from_pdf(pdf_path, start_page=0, end_page=212):
    """
    Extrae texto del PDF entre start_page y end_page (índices base 0).
    Por ejemplo, páginas 1 a 212 en el documento = índices 0 a 211 aquí.
    """
    # Convertir Path a string para compatibilidad con fitz.open si es necesario
    doc = fitz.open(str(pdf_path))
    text = ""

    # Aseguramos no exceder el número de páginas del documento
    num_pages = len(doc)
    for page_num in range(start_page, min(end_page, num_pages)): # <-- CORREGIDO: Usamos min() para evitar errores si el PDF tiene menos de 212 páginas
        page = doc.load_page(page_num)
        text += page.get_text("text") + "\n"

    doc.close()
    return text

# --- Configuración ---
# Definir rutas usando pathlib para mayor legibilidad y robustez
# Script en: backend/pipeline/01_extraction.py
# parents[0] = pipeline, parents[1] = backend, parents[2] = root
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

# Nombre del archivo PDF real en la carpeta data
pdf_filename = "FUNDAMENTOS_DE_LA_IA_VOLUMEN_I.pdf"
pdf_path = DATA_DIR / pdf_filename

# --- Ejecución ---
try:
    print(f"Buscando PDF en: {pdf_path}")
    print("Extrayendo texto del PDF (páginas 1 a 212)...")
    # Aseguramos que start_page y end_page sean números enteros
    start_page = 0
    end_page = 212
    full_text = extract_text_from_pdf(pdf_path, start_page=start_page, end_page=end_page) # <-- CORREGIDO: Pasamos explícitamente los números
    print(f"✅ Texto extraído exitosamente (1-212). Longitud: {len(full_text)} caracteres.")

    # Opcional: Imprimir las primeras líneas para verificar
    print("\n--- Primeras 500 caracteres del texto extraído (1-212) ---")
    print(full_text[:500])
    print("...\n")

    # --- Guardar el texto en un archivo .txt ---
    output_filename = "01_extraction_output.txt"
    output_file = DATA_DIR / output_filename
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"✅ Texto (1-212) guardado en '{output_file}'")

except FileNotFoundError:
    print(f"❌ Error: No se encontró el archivo PDF en la ruta: {pdf_path}")
    print("Por favor, verifica que el nombre del archivo y la ruta sean correctos.")
except Exception as e:
    print(f"❌ Ocurrió un error inesperado: {e}")
    print(f"Tipo de error: {type(e).__name__}")
