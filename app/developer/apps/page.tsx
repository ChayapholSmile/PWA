"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Package, Download, Star, Edit, Trash2 } from "lucide-react"
import type { App } from "@/lib/models/App"

export default function DeveloperAppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [filteredApps, setFilteredApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch("/api/apps/developer")
        if (response.ok) {
          const data = await response.json()
          setApps(data.apps)
          setFilteredApps(data.apps)
        }
      } catch (error) {
        console.error("Failed to fetch apps:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [])

  useEffect(() => {
    let filtered = apps

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.name.th.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.name.zh.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApps(filtered)
  }, [apps, searchQuery, statusFilter])

  const handleDelete = async (appId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบแอปนี้?")) return

    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setApps(apps.filter((app) => app._id?.toString() !== appId))
      }
    } catch (error) {
      console.error("Failed to delete app:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">แอปของฉัน</h1>
          <p className="text-muted-foreground">จัดการแอปพลิเคชันทั้งหมดของคุณ</p>
        </div>
        <Button asChild>
          <Link href="/developer/apps/new">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มแอปใหม่
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ค้นหาแอป..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">สถานะทั้งหมด</SelectItem>
            <SelectItem value="pending">รออนุมัติ</SelectItem>
            <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
            <SelectItem value="rejected">ถูกปฏิเสธ</SelectItem>
            <SelectItem value="suspended">ถูกระงับ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{apps.length === 0 ? "ยังไม่มีแอป" : "ไม่พบแอปที่ค้นหา"}</h3>
            <p className="text-muted-foreground mb-4">
              {apps.length === 0 ? "เริ่มต้นสร้างแอปแรกของคุณ" : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"}
            </p>
            {apps.length === 0 && (
              <Button asChild>
                <Link href="/developer/apps/new">
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มแอปใหม่
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app._id?.toString()} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {app.icon ? (
                        <img
                          src={`data:image/png;base64,${app.icon}`}
                          alt={app.name.th}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{app.name.th}</CardTitle>
                      <CardDescription className="line-clamp-2">{app.shortDescription.th}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved" ? "default" : app.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {app.status === "approved"
                      ? "อนุมัติ"
                      : app.status === "pending"
                        ? "รออนุมัติ"
                        : app.status === "rejected"
                          ? "ปฏิเสธ"
                          : "ระงับ"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{app.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{app.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <span className="text-xs">v{app.version}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/developer/apps/${app._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      แก้ไข
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(app._id?.toString() || "")}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
