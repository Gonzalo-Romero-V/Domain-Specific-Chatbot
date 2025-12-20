import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { Code, Database, Layers, Zap, Settings, ExternalLink, ArrowLeft } from "lucide-react"

export default function TechnicalDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Volver a Documentación
            </Link>
            <div className="flex items-center gap-2">
              <Code className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Documentación Técnica</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Resumen técnico del proyecto - Principio 80/20
            </p>
          </div>

          {/* Arquitectura */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Layers className="h-6 w-6" />
              Arquitectura
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <p><strong>Sistema RAG (Retrieval-Augmented Generation)</strong> con 3 componentes principales:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Frontend:</strong> Next.js 16 (React 19, TypeScript, Tailwind CSS)</li>
                <li><strong>Backend:</strong> FastAPI (Python 3.10+)</li>
                <li><strong>Pipeline:</strong> Procesamiento ETL del PDF (Extracción → Chunking → Embedding → ChromaDB)</li>
              </ul>
            </div>
          </section>

          {/* Stack Tecnológico */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Stack Tecnológico
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Backend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• FastAPI (API REST)</li>
                  <li>• MongoDB (Datos estructurados)</li>
                  <li>• ChromaDB (Búsqueda vectorial)</li>
                  <li>• OpenAI API (Embeddings + LLM)</li>
                  <li>• PyMuPDF (Extracción PDF)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 16 (App Router)</li>
                  <li>• React 19 + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui (Componentes)</li>
                  <li>• react-pdf-viewer</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Estructura del Proyecto */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">📂 Estructura Clave</h2>
            <div className="bg-muted/50 p-6 rounded-lg font-mono text-sm space-y-2">
              <div><strong>backend/</strong></div>
              <div className="pl-4">├── api/ (FastAPI: routers, services, models)</div>
              <div className="pl-4">├── pipeline/ (ETL: 01-06 scripts secuenciales)</div>
              <div className="pl-4">└── start_api.py</div>
              <div className="pt-2"><strong>frontend/</strong></div>
              <div className="pl-4">├── app/ (Páginas Next.js)</div>
              <div className="pl-4">├── components/ (React components)</div>
              <div className="pl-4">└── contexts/ (Estado global)</div>
              <div className="pt-2"><strong>data/</strong> (PDF, outputs, ChromaDB)</div>
            </div>
          </section>

          {/* Instalación Rápida */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Instalación Rápida
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Backend</h3>
                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-1">
                  <div>python -m venv venv</div>
                  <div>venv\Scripts\activate</div>
                  <div>pip install -r requirements.txt</div>
                  <div className="pt-2 text-xs text-muted-foreground"># Variables: OPENAI_API_KEY, MONGODB_URL</div>
                  <div className="pt-2">python backend/start_api.py</div>
                </div>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Frontend</h3>
                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-1">
                  <div>cd frontend</div>
                  <div>npm install</div>
                  <div>npm run dev</div>
                </div>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Pipeline (Primera vez)</h3>
                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                  <div>Ejecutar scripts 01-04 en orden dentro de backend/pipeline/</div>
                </div>
              </div>
            </div>
          </section>

          {/* Endpoints Principales */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🔌 Endpoints Principales</h2>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">POST</span>
                  <code className="text-sm font-mono">/api/rag</code>
                </div>
                <p className="text-sm text-muted-foreground">Ejecuta consulta RAG (pregunta → respuesta)</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-mono rounded">POST</span>
                  <code className="text-sm font-mono">/api/user</code>
                </div>
                <p className="text-sm text-muted-foreground">Crear usuario</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-mono rounded">POST</span>
                  <code className="text-sm font-mono">/api/conversation</code>
                </div>
                <p className="text-sm text-muted-foreground">Crear conversación</p>
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                <Link href="http://localhost:8000/docs" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">
                  Ver documentación completa de la API <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </section>

          {/* Flujo RAG */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Database className="h-6 w-6" />
              Flujo RAG
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li><strong>Query:</strong> Usuario envía pregunta → Frontend → API</li>
                <li><strong>Embedding:</strong> API genera vector de la pregunta (OpenAI)</li>
                <li><strong>Búsqueda:</strong> ChromaDB encuentra chunks similares (cosine similarity)</li>
                <li><strong>Filtrado:</strong> Se filtran por distancia (threshold: 0.7)</li>
                <li><strong>Generación:</strong> LLM (GPT-4o-mini) genera respuesta con contexto</li>
                <li><strong>Almacenamiento:</strong> Mensajes guardados en MongoDB (opcional)</li>
              </ol>
            </div>
          </section>

          {/* Configuración Esencial */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">⚙️ Configuración Esencial</h2>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Variables de Entorno</h3>
                <div className="bg-muted/50 p-3 rounded font-mono text-sm space-y-1">
                  <div>OPENAI_API_KEY=tu_clave</div>
                  <div>MONGODB_URL=mongodb://localhost:27017</div>
                  <div>MONGODB_DB_NAME=rag_chatbot</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Parámetros Pipeline (config.py)</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• EMBEDDING_MODEL: text-embedding-3-large</li>
                  <li>• LLM_MODEL: gpt-4o-mini</li>
                  <li>• DEFAULT_N_RESULTS: 8 chunks</li>
                  <li>• DISTANCE_THRESHOLD: 0.7</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bases de Datos */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">💾 Bases de Datos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">MongoDB</h3>
                <p className="text-sm text-muted-foreground">Colecciones:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• users (username, email)</li>
                  <li>• conversations (user_id, title)</li>
                  <li>• messages (conversation_id, role, content)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">ChromaDB</h3>
                <p className="text-sm text-muted-foreground">Colección: fundamentos_ia</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Embeddings (vectores)</li>
                  <li>• Documents (texto original)</li>
                  <li>• Metadatas</li>
                  <li>• Métrica: Cosine similarity</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enlaces */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🔗 Enlaces Técnicos</h2>
            <div className="grid gap-3">
              <Link 
                href="http://localhost:8000/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Code className="h-5 w-5" />
                <div>
                  <div className="font-semibold">API Docs (FastAPI)</div>
                  <div className="text-sm text-muted-foreground">Documentación interactiva de endpoints</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Link>
              <Link 
                href="https://github.com/Gonzalo-Romero-V/Domain-Specific-Chatbot" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Code className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Repositorio GitHub</div>
                  <div className="text-sm text-muted-foreground">Código fuente completo</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </section>

          {/* Notas */}
          <section className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">📝 Notas Importantes</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Autenticación simplificada (solo email, sin verificación de contraseña en backend)</li>
              <li>• Pipeline se ejecuta una vez para procesar el PDF</li>
              <li>• MongoDB debe estar corriendo en localhost:27017</li>
              <li>• ChromaDB se almacena localmente en data/04_store_chroma_db_output/</li>
            </ul>
          </section>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-12">
        <p className="text-xs text-muted-foreground">
          © 2024 Domain Specific Chatbot. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

