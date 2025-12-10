"use client"

import * as React from "react"
import { MessageResponse } from "@/lib/api"
import { getConversationMessages } from "@/lib/api"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ConversationContextType {
  activeConversationId: string | null
  messages: Message[]
  isLoadingMessages: boolean
  setActiveConversation: (conversationId: string | null) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  refreshMessages: () => Promise<void>
}

const ConversationContext = React.createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false)

  const loadMessages = React.useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true)
    try {
      const apiMessages = await getConversationMessages(conversationId)
      const formattedMessages: Message[] = apiMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error al cargar mensajes:", error)
      setMessages([])
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  // Cargar mensajes cuando cambia la conversación activa
  React.useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId)
    } else {
      setMessages([])
    }
  }, [activeConversationId, loadMessages])

  const setActiveConversation = React.useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId)
  }, [])

  const addMessage = React.useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  const refreshMessages = React.useCallback(async () => {
    if (activeConversationId) {
      await loadMessages(activeConversationId)
    }
  }, [activeConversationId, loadMessages])

  const value = React.useMemo(
    () => ({
      activeConversationId,
      messages,
      isLoadingMessages,
      setActiveConversation,
      addMessage,
      clearMessages,
      refreshMessages,
    }),
    [activeConversationId, messages, isLoadingMessages, setActiveConversation, addMessage, clearMessages, refreshMessages]
  )

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
}

export function useConversation() {
  const context = React.useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}

