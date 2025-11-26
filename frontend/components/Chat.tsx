"use client"

import * as React from "react"
import { Send, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  isPdfOpen: boolean
  onTogglePdf: () => void
}

export function Chat({ isPdfOpen, onTogglePdf }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Esta es una respuesta simulada. El backend aún no está conectado.",
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
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
      />

      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
        <span className="sr-only">Enviar</span>
      </Button>
      <Button 
        type="button" 
        variant={isPdfOpen ? "secondary" : "ghost"}
        size="icon" 
        onClick={onTogglePdf}
        title={isPdfOpen ? "Cerrar documento" : "Abrir documento"}
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
      
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-4xl font-bold text-center text-foreground/80">
            Bienvenido al Chatbot
          </h1>
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
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 border-t shrink-0">
            {inputForm}
          </div>
        </>
      )}
    </div>
  )
}
