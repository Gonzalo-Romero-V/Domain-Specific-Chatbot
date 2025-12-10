"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, MessageSquare, Loader2, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext"
import { useConversation } from "@/contexts/ConversationContext"
import { getUserConversations, createConversation, deleteConversation, ConversationResponse } from "@/lib/api"

interface ChatHistoryProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatHistory({ isOpen, onToggle }: ChatHistoryProps) {
  const { user } = useUser()
  const { activeConversationId, setActiveConversation, clearMessages } = useConversation()
  const [conversations, setConversations] = React.useState<ConversationResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hoveredConversationId, setHoveredConversationId] = React.useState<string | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Función para cargar conversaciones
  const loadConversations = React.useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    try {
      const convs = await getUserConversations(user.id)
      setConversations(convs)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar conversaciones"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Cargar conversaciones cuando el componente se monta o el usuario cambia
  React.useEffect(() => {
    if (user && isOpen) {
      loadConversations()
    }
  }, [user, isOpen, loadConversations])

  // Manejar creación de nueva conversación
  const handleNewConversation = async () => {
    if (!user || isCreating) return

    setIsCreating(true)
    try {
      const newConversation = await createConversation(user.id, "Nueva conversación")
      await loadConversations()
      setActiveConversation(newConversation.id)
      clearMessages()
    } catch (err) {
      console.error("Error al crear conversación:", err)
    } finally {
      setIsCreating(false)
    }
  }

  // Manejar selección de conversación
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
  }

  // Manejar eliminación de conversación
  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se seleccione la conversación al hacer click en eliminar

    if (!confirm("¿Estás seguro de que quieres eliminar esta conversación?")) {
      return
    }

    setDeletingId(conversationId)
    try {
      await deleteConversation(conversationId)
      
      // Si es la conversación activa, limpiar
      if (conversationId === activeConversationId) {
        setActiveConversation(null)
        clearMessages()
      }
      
      // Recargar lista
      await loadConversations()
    } catch (err) {
      console.error("Error al eliminar conversación:", err)
      alert("Error al eliminar la conversación")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div
      className={cn(
        "relative border-r bg-muted/10 transition-all duration-300 ease-in-out flex flex-col h-full",
        isOpen ? "w-64" : "w-[60px]"
      )}
    >
      <div className={cn("flex items-center border-b h-14 shrink-0", isOpen ? "p-4" : "justify-center")}>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", isOpen && "-ml-2 mr-2")} onClick={onToggle}>
          <History className="h-4 w-4" />
        </Button>
        {isOpen && <h2 className="font-semibold text-sm fade-in-0 animate-in duration-300">Chats</h2>}
      </div>
      
      <div className={cn("flex-1 min-h-0 relative flex flex-col", !isOpen && "hidden")}>
        {/* Botón Nueva Conversación */}
        <div className="p-2 border-b shrink-0">
          <Button
            onClick={handleNewConversation}
            disabled={isCreating}
            className="w-full justify-start"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva conversación
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="p-2 text-xs text-destructive">
                {error}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-2 text-xs text-muted-foreground text-center">
                No hay conversaciones aún
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "relative group flex items-center rounded-md",
                    activeConversationId === conversation.id && "bg-accent"
                  )}
                  onMouseEnter={() => setHoveredConversationId(conversation.id)}
                  onMouseLeave={() => setHoveredConversationId(null)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm font-normal flex-1",
                      activeConversationId === conversation.id && "bg-accent"
                    )}
                    title={conversation.title}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-left">{conversation.title}</span>
                  </Button>
                  {hoveredConversationId === conversation.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      disabled={deletingId === conversation.id}
                      title="Eliminar conversación"
                    >
                      {deletingId === conversation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
