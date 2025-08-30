"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { AppCard } from "@/components/app/app-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { Search, Filter } from "lucide-react"
import type { App } from "@/lib/models/App"

function SearchContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("q", searchQuery)
        if (category) params.append("category", category)
        params.append("sort", sortBy)
        params.append("limit", "50")

        const response = await fetch(`/api/apps?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setApps(data.apps)
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [searchQuery, category, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (searchQuery) {
      url.searchParams.set("q", searchQuery)
    } else {
      url.searchParams.delete("q")
    }
    window.history.pushState({}, "", url.toString())
  }

  const categories = [
    { value: "", label: t("language") === "th" ? "ทั้งหมด" : t("language") === "en" ? "All" : "全部" },
    {
      value: "productivity",
      label: t("language") === "th" ? "ประสิทธิภาพ" : t("language") === "en" ? "Productivity" : "生产力",
    },
    {
      value: "entertainment",
      label: t("language") === "th" ? "บันเทิง" : t("language") === "en" ? "Entertainment" : "娱乐",
    },
    { value: "education", label: t("language") === "th" ? "การศึกษา" : t("language") === "en" ? "Education" : "教育" },
    { value: "business", label: t("language") === "th" ? "ธุรกิจ" : t("language") === "en" ? "Business" : "商业" },
    { value: "utilities", label: t("language") === "th" ? "เครื่องมือ" : t("language") === "en" ? "Utilities" : "工具" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t("language") === "th" && "ค้นหาแอป"}
            {t("language") === "en" && "Search Apps"}
            {t("language") === "zh" && "搜索应用"}
          </h1>

          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1">
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
                className="pl-12"
              />
            </div>
            <Button type="submit">
              {t("language") === "th" ? "ค้นหา" : t("language") === "en" ? "Search" : "搜索"}
            </Button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                {t("language") === "th" ? "กรอง:" : t("language") === "en" ? "Filter:" : "筛选:"}
              </span>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background"
            >
              <option value="recent">
                {t("language") === "th" ? "ล่าสุด" : t("language") === "en" ? "Recent" : "最新"}
              </option>
              <option value="popular">
                {t("language") === "th" ? "ยอดนิยม" : t("language") === "en" ? "Popular" : "热门"}
              </option>
              <option value="rating">
                {t("language") === "th" ? "คะแนน" : t("language") === "en" ? "Rating" : "评分"}
              </option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {loading ? (
              t("language") === "th" ? (
                "กำลังค้นหา..."
              ) : t("language") === "en" ? (
                "Searching..."
              ) : (
                "搜索中..."
              )
            ) : (
              <>
                {t("language") === "th" && `พบ ${apps.length} แอป`}
                {t("language") === "en" && `Found ${apps.length} apps`}
                {t("language") === "zh" && `找到 ${apps.length} 个应用`}
                {searchQuery && (
                  <>
                    {" "}
                    {t("language") === "th" && `สำหรับ "${searchQuery}"`}
                    {t("language") === "en" && `for "${searchQuery}"`}
                    {t("language") === "zh" && `关于 "${searchQuery}"`}
                  </>
                )}
              </>
            )}
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app) => (
              <AppCard key={app._id?.toString()} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              {t("language") === "th" && "ไม่พบแอปที่ค้นหา"}
              {t("language") === "en" && "No apps found"}
              {t("language") === "zh" && "未找到应用"}
            </h3>
            <p className="text-muted-foreground">
              {t("language") === "th" && "ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ที่แตกต่างกัน"}
              {t("language") === "en" && "Try different search terms or select a different category"}
              {t("language") === "zh" && "尝试不同的搜索词或选择不同的类别"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
