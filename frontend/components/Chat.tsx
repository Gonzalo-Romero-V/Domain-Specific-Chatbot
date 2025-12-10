"use client"

import * as React from "react"
import { Send, BookOpen, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { sendRAGQuery, createConversation } from "@/lib/api"
import { useUser } from "@/contexts/UserContext"
import { useConversation, Message } from "@/contexts/ConversationContext"

interface ChatProps {
  isPdfOpen: boolean
  onTogglePdf: () => void
}

export function Chat({ isPdfOpen, onTogglePdf }: ChatProps) {
  const { user } = useUser()
  const {
    activeConversationId,
    messages,
    isLoadingMessages,
    addMessage,
    setActiveConversation,
  } = useConversation()
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll al último mensaje
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return

    let currentConversationId = activeConversationId

    // Si no hay conversación activa, crear una nueva
    if (!currentConversationId) {
      try {
        const newConversation = await createConversation(user.id, "Nueva conversación")
        currentConversationId = newConversation.id
        setActiveConversation(newConversation.id)
      } catch (err) {
        console.error("Error al crear conversación:", err)
        setError("Error al crear conversación. Por favor, intenta de nuevo.")
        return
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    // Agregar mensaje del usuario inmediatamente
    addMessage(userMessage)
    setInput("")
    setError(null)
    setLoading(true)

    try {
      // Llamar a la API con conversationId
      const response = await sendRAGQuery(
        userMessage.content,
        currentConversationId
      )

      // Agregar respuesta del assistant
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
      }
      addMessage(assistantMessage)
    } catch (err) {
      // Manejar errores
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al conectar con el servidor. Por favor, intenta de nuevo."
      setError(errorMessage)

      // Agregar mensaje de error del assistant
      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Lo siento, ocurrió un error: ${errorMessage}`,
      }
      addMessage(errorAssistantMessage)
    } finally {
      setLoading(false)
    }
  }

  const inputForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSend()
      }}
      className="flex gap-2 max-w-3xl mx-auto w-full"
    >
      <Input
        placeholder="Escribe un mensaje..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />

      <Button type="submit" size="icon" disabled={loading || !input.trim()}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Enviar</span>
      </Button>
      <Button 
        type="button" 
        variant={isPdfOpen ? "secondary" : "ghost"}
        size="icon" 
        onClick={onTogglePdf}
        title={isPdfOpen ? "Cerrar documento" : "Abrir documento"}
        disabled={loading}
      >
        <BookOpen className="h-4 w-4" />
        <span className="sr-only">Documento</span>
      </Button>
    </form>
  )

  return (
    <div className="flex flex-col h-full w-full bg-background shadow-sm min-h-0">
      <div className="p-4 border-b bg-muted/50 shrink-0 h-14 flex items-center">
        <h2 className="font-semibold text-sm">Chat Assistant</h2>
      </div>
      
      {isLoadingMessages ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-4xl font-bold text-center text-foreground/80">
            {activeConversationId ? "Conversación vacía" : "Bienvenido al Chatbot"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {activeConversationId
              ? "Comienza a escribir para iniciar la conversación"
              : "Selecciona una conversación o crea una nueva para comenzar"}
          </p>
          <div className="w-full max-w-3xl">
            {inputForm}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 relative">
            <ScrollArea className="h-full w-full rounded-none">
              <div className="p-4 space-y-4 max-w-3xl mx-auto w-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      <span className="text-muted-foreground">Pensando...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <p className="text-sm text-destructive max-w-3xl mx-auto">
                {error}
              </p>
            </div>
          )}
          <div className="p-4 border-t shrink-0">
            {inputForm}
          </div>
        </>
      )}
    </div>
  )
}
