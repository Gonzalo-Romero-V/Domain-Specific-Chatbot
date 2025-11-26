"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatHistoryProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatHistory({ isOpen, onToggle }: ChatHistoryProps) {
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
        {isOpen && <h2 className="font-semibold text-sm fade-in-0 animate-in duration-300">Historial</h2>}
      </div>
      
      <div className={cn("flex-1 min-h-0 relative", !isOpen && "hidden")}>
        <ScrollArea className="h-full w-full">
          <div className="p-2 space-y-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
              >
                <MessageSquare className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Conversación sobre IA {i + 1}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
