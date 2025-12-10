"""
STEP 6 — Ejecución completa del sistema RAG

- Lee parámetros desde config.py
- Recuperación de información (STEP 5)
- Generación de respuesta LLM (STEP 6)
"""

from utils import get_openai_client
from config import (
    QUERY,
    DEFAULT_MODE,
    DEFAULT_N_RESULTS,
    DISTANCE_THRESHOLD,
    LLM_MODEL,
    MAX_TOKENS,
    TEMPERATURE,
    SYSTEM_PROMPT,
    USER_PROMPT_TEMPLATE
)
import importlib

# Import dinámico del motor de recuperación
query_core = importlib.import_module("05_query_core")
retrieve = query_core.retrieve

client_openai = get_openai_client()


# =============================
# STEP 6 — LLM Response
# =============================
def generar_respuesta(query: str, chunks: list):
    """Genera respuesta usando los documentos recuperados."""

    if not chunks:
        context_section = ""
    else:
        # Concatenar y numerar los fragments para mejor legibilidad
        context_text = "\n\n".join([f"[{i+1}] {c['document']}" for i, c in enumerate(chunks)])
        context_section = f"Contexto:\n{context_text}"

    prompt = USER_PROMPT_TEMPLATE.format(
        query=query,
        context_section=context_section
    )

    completion = client_openai.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE
    )

    return completion.choices[0].message.content


# =============================
# FUNCIÓN PRINCIPAL PIPELINE
# =============================
def rag_query(
    query: str = None,
    mode: str = None,
    n_results: int = None,
    distance_threshold: float = None
):
    """Pipeline principal del sistema RAG."""

    # Query desde config si no se pasa manualmente
    if query is None:
        query = QUERY

    # Modo por defecto desde config
    if mode is None:
        mode = DEFAULT_MODE

    # Recuperación
    if n_results is None:
        n_results = DEFAULT_N_RESULTS

    if distance_threshold is None:
        distance_threshold = DISTANCE_THRESHOLD

    chunks = retrieve(query, n_results, distance_threshold)

    if mode == "raw":
        return {"query": query, "chunks": chunks}

    # Generación final
    respuesta = generar_respuesta(query, chunks)

    return {"query": query, "chunks": chunks, "respuesta": respuesta}


# =============================
# FUNCIÓN SIMPLIFICADA PARA API
# =============================
def run_rag(query: str) -> str:
    """
    Función simplificada para ejecutar el pipeline RAG y retornar solo la respuesta.
    Usada por el backend FastAPI.
    
    Args:
        query: Pregunta del usuario
        
    Returns:
        str: Respuesta generada por el LLM
        
    Raises:
        Exception: Si hay error en el pipeline
    """
    try:
        resultado = rag_query(query=query, mode="full")
        return resultado.get("respuesta", "No se pudo generar una respuesta.")
    except Exception as e:
        raise Exception(f"Error en pipeline RAG: {str(e)}")


# =============================
# IMPRESIÓN PULIDA DE RESULTADO
# =============================
def imprimir_resultado(resultado: dict):
    print("\n=== RAG QUERY RESULT ===")
    print(f"\nPregunta: {resultado['query']}\n")
    
    if resultado["chunks"]:
        print("Chunks recuperados:")
        for i, c in enumerate(resultado["chunks"], start=1):
            print(f"\n[{i}] (Distancia: {c['distance']:.3f})")
            print(f"{c['document']}")
            if "metadata" in c:
                print(f"Fuente: {c['metadata'].get('source', 'N/A')}")
    else:
        print("No se recuperaron chunks.")
    
    if "respuesta" in resultado:
        print("\nRespuesta generada por el LLM:\n")
        print(resultado["respuesta"])
    print("\n========================\n")


# Si ejecutas el archivo → correr automático
if __name__ == "__main__":
    resultado = rag_query()
    imprimir_resultado(resultado)
