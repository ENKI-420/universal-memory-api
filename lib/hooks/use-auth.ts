"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("pcr_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("pcr_token")
    localStorage.removeItem("pcr_user")
    setUser(null)
    router.push("/login")
  }

  const getToken = (): string | null => {
    return localStorage.getItem("pcr_token")
  }

  const isAuthenticated = (): boolean => {
    return !!user && !!getToken()
  }

  const hasRole = (roles: string[]): boolean => {
    return !!user && roles.includes(user.role)
  }

  return {
    user,
    loading,
    logout,
    getToken,
    isAuthenticated,
    hasRole,
  }
}
