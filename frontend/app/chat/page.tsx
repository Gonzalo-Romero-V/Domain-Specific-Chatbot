"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic";
import { Chat } from "@/components/Chat";
import { ChatHistory } from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { History, BookOpen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { Loader2 } from "lucide-react";

const PdfViewer = dynamic(() => import("@/components/PdfViewer").then(mod => mod.PdfViewer), {
  ssr: false,
});

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useUser()
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true)
  const [isPdfOpen, setIsPdfOpen] = React.useState(true)

  // Proteger ruta: redirigir a login si no hay usuario
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Mostrar loading mientras se verifica el usuario
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // No mostrar nada si no hay usuario (será redirigido)
  if (!user) {
    return null
  }

  return (
    <main className="flex h-screen max-h-screen flex-col overflow-hidden supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:max-h-[100dvh]">
      <div className="flex w-full items-center justify-between p-4 border-b shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Domain Specific Chatbot</h1>
            <h3 className="text-xs text-muted-foreground hidden sm:block mt-1">FUNDAMENTOS DE LA INTELIGENCIA ARTIFICIAL: UNA VISION INTRODUCTORIA</h3>
          </div>
        </div>

                <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground hidden md:block">
            {user.username}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
      
      <ConversationProvider>
        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          <ChatHistory isOpen={isHistoryOpen} onToggle={() => setIsHistoryOpen(!isHistoryOpen)} />
          
          <div className="flex-1 flex flex-col min-w-0 bg-background min-h-0 relative border-r border-l">
            <Chat isPdfOpen={isPdfOpen} onTogglePdf={() => setIsPdfOpen(!isPdfOpen)} />
          </div>

          <PdfViewer isOpen={isPdfOpen} onToggle={() => setIsPdfOpen(!isPdfOpen)} url="/document.pdf" />
        </div>
      </ConversationProvider>
    </main>
  );
}
