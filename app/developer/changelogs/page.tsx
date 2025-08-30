"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Calendar, Edit, Trash2 } from "lucide-react"
import type { Changelog } from "@/lib/models/Changelog"
import type { App } from "@/lib/models/App"

export default function DeveloperChangelogsPage() {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [filteredChangelogs, setFilteredChangelogs] = useState<Changelog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [appFilter, setAppFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [changelogsResponse, appsResponse] = await Promise.all([
          fetch("/api/changelogs"),
          fetch("/api/apps/developer"),
        ])

        if (changelogsResponse.ok) {
          const changelogsData = await changelogsResponse.json()
          setChangelogs(changelogsData.changelogs)
          setFilteredChangelogs(changelogsData.changelogs)
        }

        if (appsResponse.ok) {
          const appsData = await appsResponse.json()
          setApps(appsData.apps)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = changelogs

    if (searchQuery) {
      filtered = filtered.filter(
        (changelog) =>
          changelog.title.th.toLowerCase().includes(searchQuery.toLowerCase()) ||
          changelog.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          changelog.title.zh.toLowerCase().includes(searchQuery.toLowerCase()) ||
          changelog.version.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (appFilter !== "all") {
      filtered = filtered.filter((changelog) => changelog.appId.toString() === appFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((changelog) => changelog.type === typeFilter)
    }

    setFilteredChangelogs(filtered)
  }, [changelogs, searchQuery, appFilter, typeFilter])

  const handleDelete = async (changelogId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบ Changelog นี้?")) return

    try {
      const response = await fetch(`/api/changelogs/${changelogId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setChangelogs(changelogs.filter((changelog) => changelog._id?.toString() !== changelogId))
      }
    } catch (error) {
      console.error("Failed to delete changelog:", error)
    }
  }

  const getAppName = (appId: string) => {
    const app = apps.find((a) => a._id?.toString() === appId)
    return app?.name.th || "Unknown App"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-red-100 text-red-800"
      case "minor":
        return "bg-blue-100 text-blue-800"
      case "patch":
        return "bg-green-100 text-green-800"
      case "hotfix":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "major":
        return "เวอร์ชันใหญ่"
      case "minor":
        return "เวอร์ชันย่อย"
      case "patch":
        return "แก้ไขบัค"
      case "hotfix":
        return "แก้ไขด่วน"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">Changelog</h1>
          <p className="text-muted-foreground">จัดการประวัติการอัปเดตแอปของคุณ</p>
        </div>
        <Button asChild>
          <Link href="/developer/changelogs/new">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่ม Changelog ใหม่
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ค้นหา Changelog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="แอปทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">แอปทั้งหมด</SelectItem>
            {apps.map((app) => (
              <SelectItem key={app._id?.toString()} value={app._id?.toString() || ""}>
                {app.name.th}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="ประเภททั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ประเภททั้งหมด</SelectItem>
            <SelectItem value="major">เวอร์ชันใหญ่</SelectItem>
            <SelectItem value="minor">เวอร์ชันย่อย</SelectItem>
            <SelectItem value="patch">แก้ไขบัค</SelectItem>
            <SelectItem value="hotfix">แก้ไขด่วน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Changelogs List */}
      {filteredChangelogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {changelogs.length === 0 ? "ยังไม่มี Changelog" : "ไม่พบ Changelog ที่ค้นหา"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {changelogs.length === 0 ? "เริ่มต้นสร้าง Changelog แรกของคุณ" : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"}
            </p>
            {changelogs.length === 0 && (
              <Button asChild>
                <Link href="/developer/changelogs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่ม Changelog ใหม่
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredChangelogs.map((changelog) => (
            <Card key={changelog._id?.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{changelog.title.th}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        v{changelog.version}
                      </Badge>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(changelog.type)}`}>
                        {getTypeLabel(changelog.type)}
                      </span>
                    </div>
                    <CardDescription>{getAppName(changelog.appId.toString())}</CardDescription>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(changelog.releaseDate).toLocaleDateString("th-TH")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/developer/changelogs/${changelog._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(changelog._id?.toString() || "")}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm line-clamp-3">{changelog.content.th}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
