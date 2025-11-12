"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading, isAuthenticated, hasRole } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push("/login")
      } else if (requiredRoles && !hasRole(requiredRoles)) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, isAuthenticated, hasRole, requiredRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated() || (requiredRoles && !hasRole(requiredRoles))) {
    return null
  }

  return <>{children}</>
}
