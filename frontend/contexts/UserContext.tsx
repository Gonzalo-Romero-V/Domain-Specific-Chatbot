"use client"

import * as React from "react"
import { UserResponse } from "@/lib/api"

interface UserContextType {
  user: UserResponse | null
  isLoading: boolean
  login: (user: UserResponse) => void
  logout: () => void
  register: (user: UserResponse) => void
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = "rag_chatbot_user"

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Cargar usuario del localStorage al montar
  React.useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = React.useCallback((userData: UserResponse) => {
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }, [])

  const register = React.useCallback((userData: UserResponse) => {
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      register,
    }),
    [user, isLoading, login, logout, register]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

