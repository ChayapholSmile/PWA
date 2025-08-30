"use client"

import type React from "react"

import { useAuth } from "@/lib/hooks/use-auth"
import { DeveloperSidebar } from "@/components/developer/sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "developer")) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "developer") {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DeveloperSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
