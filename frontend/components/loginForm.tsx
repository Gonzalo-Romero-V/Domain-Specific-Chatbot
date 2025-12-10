"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getUserByEmail } from "@/lib/api"
import { useUser } from "@/contexts/UserContext"

export function LoginForm() {
  const router = useRouter()
  const { login } = useUser()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setError(null)
    
    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos")
      return
    }

    setIsLoading(true)

    try {
      // Buscar usuario por email (autenticación simplificada)
      const user = await getUserByEmail(email.trim())
      
      // Guardar usuario en contexto y localStorage
      login(user)
      
      // Redirigir al chat
      router.push("/chat")
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Verifica tus credenciales."
      
      if (errorMessage.includes("404") || errorMessage.includes("no encontrado")) {
        setError("Usuario no encontrado. Por favor, regístrate primero.")
      } else {
        setError(errorMessage)
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2 text-center max-w-md mx-auto w-full p-6 bg-background shadow-sm border rounded-lg">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder al chat
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
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Ingresar
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>
         <div className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Regístrate
            </Link>
        </div>
      </div>
    </div>
  )
}
