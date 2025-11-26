"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

import { Worker, Viewer } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

interface PdfViewerProps {
  isOpen: boolean
  onToggle: () => void
  url: string
}

export function PdfViewer({ isOpen, onToggle, url }: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div
      className={cn(
        "relative border-l bg-muted/10 transition-all duration-300 ease-in-out flex flex-col h-full",
        isOpen ? "w-1/2 min-w-[400px]" : "w-[0px] border-none"
      )}
    >
      <div className={cn("flex items-center justify-between border-b h-14 shrink-0 px-4", !isOpen && "hidden")}>
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          <h2 className="font-semibold text-sm">Documento PDF</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Viewer */}
      <div className={cn("flex-1 m-0 overflow-auto", !isOpen && "hidden")}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer 
            fileUrl={url}
            defaultScale={1.25}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  )
}
