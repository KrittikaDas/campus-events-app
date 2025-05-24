"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "faculty"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: "student" | "faculty") => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("campus-events-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be a server request
    const users = JSON.parse(localStorage.getItem("campus-events-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("campus-events-user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "student" | "faculty",
  ): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem("campus-events-users") || "[]")

    if (users.find((u: any) => u.email === email)) {
      return false // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
    }

    users.push(newUser)
    localStorage.setItem("campus-events-users", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("campus-events-user", JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("campus-events-user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
