"use client"

import { useEffect, useState } from "react"
import { AppCard } from "./app-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { App } from "@/lib/models/App"

export function FeaturedApps() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchFeaturedApps = async () => {
      try {
        const response = await fetch("/api/apps?featured=true&limit=6")
        if (response.ok) {
          const data = await response.json()
          setApps(data.apps)
        }
      } catch (error) {
        console.error("Failed to fetch featured apps:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedApps()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, apps.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, apps.length - 2)) % Math.max(1, apps.length - 2))
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">แอปแนะนำ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (apps.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">แอปแนะนำ</h2>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevSlide} disabled={apps.length <= 3}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide} disabled={apps.length <= 3}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
          >
            {apps.map((app) => (
              <div key={app._id?.toString()} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
                <AppCard app={app} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
