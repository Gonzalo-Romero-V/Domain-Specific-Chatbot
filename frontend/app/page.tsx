  "use client"

import * as React from "react"
import dynamic from "next/dynamic";
import { Chat } from "@/components/Chat";
import { ChatHistory } from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { History, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const PdfViewer = dynamic(() => import("@/components/PdfViewer").then(mod => mod.PdfViewer), {
  ssr: false,
});

export default function Home() {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true)
  const [isPdfOpen, setIsPdfOpen] = React.useState(true)

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
          <div className="text-base font-bold hidden md:block">
            GRUPO 00
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        <ChatHistory isOpen={isHistoryOpen} onToggle={() => setIsHistoryOpen(!isHistoryOpen)} />
        
        <div className="flex-1 flex flex-col min-w-0 bg-background min-h-0 relative border-r border-l">
          <Chat isPdfOpen={isPdfOpen} onTogglePdf={() => setIsPdfOpen(!isPdfOpen)} />
        </div>

        <PdfViewer isOpen={isPdfOpen} onToggle={() => setIsPdfOpen(!isPdfOpen)} url="/document.pdf" />
      </div>
    </main>
  );
}