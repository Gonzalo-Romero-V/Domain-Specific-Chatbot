"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createUser } from "@/lib/api"
import { useUser } from "@/contexts/UserContext"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useUser()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setError(null)
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      // Crear usuario en la API
      const user = await createUser(username.trim(), email.trim())
      
      // Guardar usuario en contexto y localStorage
      register(user)
      
      // Redirigir al chat
      router.push("/chat")
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al crear la cuenta. Por favor, intenta de nuevo."
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2 text-center max-w-md mx-auto w-full p-6 bg-background shadow-sm border rounded-lg">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crear una cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus datos para registrarte
        </p>
      </div>
      <div className="grid gap-6 pt-4">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
             <div className="grid gap-2 text-left">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                placeholder="Usuario"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="nombre@ejemplo.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrarse
            </Button>
          </div>
        </form>
         <div className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Inicia sesión
            </Link>
        </div>
      </div>
    </div>
  )
}
