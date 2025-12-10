import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
      <Link className="flex items-center gap-2 font-semibold" href="/">
        <span className="text-lg">Domain Specific Chatbot</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost">Iniciar Sesión</Button>
        </Link>
        <Link href="/register">
          <Button>Registrarse</Button>
        </Link>
      </nav>
    </header>
  )
}
