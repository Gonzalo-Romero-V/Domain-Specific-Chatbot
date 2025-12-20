import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { BookOpen, MessageSquare, FileText, Github, ExternalLink, HelpCircle } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Documentación</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Guía rápida para usar el chatbot especializado en Fundamentos de la Inteligencia Artificial
            </p>
          </div>

          {/* ¿Qué es? */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              ¿Qué es este chatbot?
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <p>
                Es un asistente académico inteligente que responde preguntas basándose <strong>únicamente</strong> en el libro 
                <strong> "Fundamentos de la Inteligencia Artificial: Una visión introductoria — Volumen I"</strong>.
              </p>
              <p>
                A diferencia de otros chatbots, este sistema está diseñado para evitar información incorrecta, ya que solo utiliza 
                el contenido del libro como fuente de conocimiento.
              </p>
            </div>
          </section>

          {/* Cómo usar */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              ¿Cómo usarlo?
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">1. Crear una cuenta</h3>
                <p className="text-muted-foreground">
                  Regístrate con tu nombre de usuario, email y una contraseña (mínimo 6 caracteres).
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">2. Iniciar sesión</h3>
                <p className="text-muted-foreground">
                  Ingresa con tu email para acceder al chat.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">3. Hacer preguntas</h3>
                <p className="text-muted-foreground">
                  Escribe tus preguntas sobre el contenido del libro en lenguaje natural. El chatbot buscará 
                  la información más relevante y te dará una respuesta basada en el texto del libro.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">4. Ver el documento</h3>
                <p className="text-muted-foreground">
                  Puedes visualizar el PDF del libro directamente en la interfaz para consultar las fuentes.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">5. Historial de conversaciones</h3>
                <p className="text-muted-foreground">
                  Todas tus conversaciones se guardan automáticamente. Puedes crear nuevas conversaciones o 
                  continuar con las anteriores.
                </p>
              </div>
            </div>
          </section>

          {/* Fuente de conocimiento */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Fuente de Conocimiento
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <p>
                <strong>Título:</strong> Fundamentos de la Inteligencia Artificial: Una visión introductoria — Volumen I
              </p>
              <p>
                <strong>Editorial:</strong> Puerto Madero
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link 
                  href="https://puertomaderoeditorial.com.ar/index.php/pmea/catalog/book/77" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver en Editorial
                  </Button>
                </Link>
                <Link 
                  href="https://doi.org/10.55204/pmea.77" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver DOI
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">💡 Consejos para mejores resultados</h2>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Haz preguntas específicas sobre conceptos del libro</li>
              <li>Puedes preguntar sobre definiciones, ejemplos o explicaciones de temas</li>
              <li>Si la respuesta no es suficiente, reformula tu pregunta de otra manera</li>
              <li>El chatbot te indicará si no encuentra información relevante en el libro</li>
            </ul>
          </section>

          {/* Enlaces útiles */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🔗 Enlaces Útiles</h2>
            <div className="grid gap-3">
              <Link 
                href="/docs/technical"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Documentación Técnica</div>
                  <div className="text-sm text-muted-foreground">Resumen técnico del proyecto (80/20)</div>
                </div>
              </Link>
              <Link 
                href="https://github.com/Gonzalo-Romero-V/Domain-Specific-Chatbot" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Github className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Repositorio del Proyecto</div>
                  <div className="text-sm text-muted-foreground">Código fuente en GitHub</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Link>
              <Link 
                href="http://localhost:8000/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <div>
                  <div className="font-semibold">Documentación de la API</div>
                  <div className="text-sm text-muted-foreground">Endpoints y especificaciones técnicas</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 pt-8 border-t">
            <p className="text-lg">¿Listo para comenzar?</p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Crear cuenta</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Iniciar sesión</Button>
              </Link>
            </div>
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

