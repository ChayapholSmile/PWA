"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Download, Star, Plus, Eye } from "lucide-react"
import Link from "next/link"
import type { App } from "@/lib/models/App"

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [stats, setStats] = useState({
    totalApps: 0,
    totalDownloads: 0,
    averageRating: 0,
    pendingApps: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/apps/developer")
        if (response.ok) {
          const data = await response.json()
          setApps(data.apps)

          // Calculate stats
          const totalApps = data.apps.length
          const totalDownloads = data.apps.reduce((sum: number, app: App) => sum + app.downloads, 0)
          const averageRating =
            data.apps.length > 0
              ? data.apps.reduce((sum: number, app: App) => sum + app.rating, 0) / data.apps.length
              : 0
          const pendingApps = data.apps.filter((app: App) => app.status === "pending").length

          setStats({
            totalApps,
            totalDownloads,
            averageRating,
            pendingApps,
          })
        }
      } catch (error) {
        console.error("Failed to fetch developer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">สวัสดี, {user?.name}</h1>
          <p className="text-muted-foreground">จัดการแอปและติดตามสถิติของคุณ</p>
        </div>
        <Button asChild>
          <Link href="/developer/apps/new">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มแอปใหม่
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แอปทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApps}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingApps > 0 && `${stats.pendingApps} รออนุมัติ`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ดาวน์โหลดทั้งหมด</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">จากแอปทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">จาก 5 คะแนน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดดูรวม</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">เร็วๆ นี้</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Apps */}
      <Card>
        <CardHeader>
          <CardTitle>แอปล่าสุด</CardTitle>
          <CardDescription>แอปที่คุณอัปเดตล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">ยังไม่มีแอป</h3>
              <p className="text-muted-foreground mb-4">เริ่มต้นสร้างแอปแรกของคุณ</p>
              <Button asChild>
                <Link href="/developer/apps/new">
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มแอปใหม่
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apps.slice(0, 5).map((app) => (
                <div key={app._id?.toString()} className="flex items-center justify-between p-4 border rounded-lg">
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
                    <div>
                      <h4 className="font-medium">{app.name.th}</h4>
                      <p className="text-sm text-muted-foreground">
                        {app.downloads.toLocaleString()} ดาวน์โหลด • {app.rating.toFixed(1)} ⭐
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : app.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status === "approved" ? "อนุมัติแล้ว" : app.status === "pending" ? "รออนุมัติ" : "ถูกปฏิเสธ"}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/developer/apps/${app._id}`}>จัดการ</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
