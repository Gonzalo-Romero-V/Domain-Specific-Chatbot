# utils.py
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

def get_openai_client():
    """Devuelve un cliente de OpenAI configurado con la API key."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("No se encontró la API key en las variables de entorno.")
    return OpenAI(api_key=api_key)