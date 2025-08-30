"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { FeaturedApps } from "@/components/app/featured-apps"
import { AppCategories } from "@/components/app/app-categories"
import { AppCard } from "@/components/app/app-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"
import { Search, TrendingUp, Clock } from "lucide-react"
import type { App } from "@/lib/models/App"

export default function HomePage() {
  const { t } = useLanguage()
  const [recentApps, setRecentApps] = useState<App[]>([])
  const [popularApps, setPopularApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const [recentResponse, popularResponse] = await Promise.all([
          fetch("/api/apps?sort=recent&limit=6"),
          fetch("/api/apps?sort=popular&limit=6"),
        ])

        if (recentResponse.ok) {
          const recentData = await recentResponse.json()
          setRecentApps(recentData.apps)
        }

        if (popularResponse.ok) {
          const popularData = await popularResponse.json()
          setPopularApps(popularData.apps)
        }
      } catch (error) {
        console.error("Failed to fetch apps:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            {t("language") === "th" && (
              <>
                ค้นหาแอป PWA
                <span className="text-primary block">ที่ดีที่สุด</span>
              </>
            )}
            {t("language") === "en" && (
              <>
                Discover the Best
                <span className="text-primary block">PWA Apps</span>
              </>
            )}
            {t("language") === "zh" && (
              <>
                发现最好的
                <span className="text-primary block">PWA 应用</span>
              </>
            )}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            {t("language") === "th" && "เปิดประสบการณ์ใหม่กับแอปพลิเคชันเว็บที่ทันสมัย รวดเร็ว และใช้งานได้ทุกที่"}
            {t("language") === "en" && "Experience modern, fast, and accessible web applications that work everywhere"}
            {t("language") === "zh" && "体验现代、快速且随处可用的网络应用程序"}
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder={
                  t("language") === "th"
                    ? "ค้นหาแอปที่คุณต้องการ..."
                    : t("language") === "en"
                      ? "Search for apps you need..."
                      : "搜索您需要的应用..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
              <Button type="submit" className="absolute right-2 top-2 h-8">
                {t("search")}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <FeaturedApps />
      <AppCategories />

      {/* Recent Apps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">{t("recentApps")}</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentApps.map((app) => (
                <AppCard key={app._id?.toString()} app={app} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Apps */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">{t("popularApps")}</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularApps.map((app) => (
                <AppCard key={app._id?.toString()} app={app} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PWA</span>
            </div>
            <span className="font-bold text-xl">App Store</span>
          </div>
          <p className="text-muted-foreground">
            {t("language") === "th" && "แพลตฟอร์มแอป PWA ที่ดีที่สุด สำหรับนักพัฒนาและผู้ใช้งาน"}
            {t("language") === "en" && "The best PWA app platform for developers and users"}
            {t("language") === "zh" && "面向开发者和用户的最佳 PWA 应用平台"}
          </p>
        </div>
      </footer>
    </div>
  )
}
