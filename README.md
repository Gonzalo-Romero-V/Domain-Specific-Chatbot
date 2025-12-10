
# 🧠 Domain-Specific Chatbot
**Asistente académico inteligente basado exclusivamente en el libro “Fundamentos de la Inteligencia Artificial: Una visión introductoria — Volumen I”.**

---

## Objetivo del Proyecto

Desarrollar un chatbot conversacional que:

1. **Entienda preguntas en lenguaje natural.**  
2. **Busque y recupere** los fragmentos más relevantes del libro en formato PDF.  
3. **Muestre respuestas basadas únicamente en el contenido del libro.**  
4. **Informe cuando no existe contenido relevante.**

Este proyecto implementa un enfoque **RAG simple**.


## Fuente principal del conocimiento

Este chatbot utiliza como única base de conocimiento el libro:

**"Fundamentos de la Inteligencia Artificial: Una visión introductoria — Volumen I"**  
- **Editorial:** Puerto Madero  
- **Enlace:** https://puertomaderoeditorial.com.ar/index.php/pmea/catalog/book/77  
- **DOI:** https://doi.org/10.55204/pmea.77  





---

## Tecnologías y Herramientas Principales

### Backend (Python)
- Librerías principales: `openai`, `PyMuPDF`

- Ejemplo de imports (listas aquí para referencia):
	- `import json`
	- `import uuid`
	- `from typing import List, Dict, Any`
	- `from openai import OpenAI`
	- `import fitz  # PyMuPDF`



- Crear y Activar entorno virtual (venv):

	```powershell
	python -m venv venv
	venv\Scripts\activate
	```


- Instalar dependencias:

	```powershell
	pip install -r requirements.txt
	```

### Frontend
- Detalle

## Estructura del Repositorio


- **Enlace:** https://github.com/Gonzalo-Romero-V/Domain-Specific-Chatbot.git


## Proceso Realizado
