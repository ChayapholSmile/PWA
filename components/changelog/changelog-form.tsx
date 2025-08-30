"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { Changelog } from "@/lib/models/Changelog"
import type { App } from "@/lib/models/App"

interface ChangelogFormProps {
  changelog?: Changelog
  mode: "create" | "edit"
  appId?: string
}

export function ChangelogForm({ changelog, mode, appId }: ChangelogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apps, setApps] = useState<App[]>([])

  const [formData, setFormData] = useState({
    appId: changelog?.appId?.toString() || appId || "",
    version: changelog?.version || "",
    title: {
      th: changelog?.title.th || "",
      en: changelog?.title.en || "",
      zh: changelog?.title.zh || "",
    },
    content: {
      th: changelog?.content.th || "",
      en: changelog?.content.en || "",
      zh: changelog?.content.zh || "",
    },
    type: changelog?.type || "patch",
    releaseDate: changelog?.releaseDate
      ? new Date(changelog.releaseDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch("/api/apps/developer")
        if (response.ok) {
          const data = await response.json()
          setApps(data.apps)
        }
      } catch (error) {
        console.error("Failed to fetch apps:", error)
      }
    }

    if (!appId) {
      fetchApps()
    }
  }, [appId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = mode === "create" ? "/api/changelogs" : `/api/changelogs/${changelog?._id}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save changelog")
      }

      router.push("/developer/changelogs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changelog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
          <CardDescription>ข้อมูลหลักของ Changelog</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appId">แอป *</Label>
              <Select
                value={formData.appId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, appId: value }))}
                disabled={!!appId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแอป" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectItem key={app._id?.toString()} value={app._id?.toString() || ""}>
                      {app.name.th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">เวอร์ชัน *</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="1.0.0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">ประเภท *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">เวอร์ชันใหญ่ (Major)</SelectItem>
                  <SelectItem value="minor">เวอร์ชันย่อย (Minor)</SelectItem>
                  <SelectItem value="patch">แก้ไขบัค (Patch)</SelectItem>
                  <SelectItem value="hotfix">แก้ไขด่วน (Hotfix)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">วันที่ปล่อย *</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, releaseDate: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="th" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="th">ไทย</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="zh">中文</TabsTrigger>
        </TabsList>

        <TabsContent value="th" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>เนื้อหา (ไทย)</CardTitle>
              <CardDescription>หัวข้อและรายละเอียดการอัปเดตเป็นภาษาไทย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-th">หัวข้อ *</Label>
                <Input
                  id="title-th"
                  value={formData.title.th}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: { ...prev.title, th: e.target.value },
                    }))
                  }
                  placeholder="เช่น แก้ไขบัคและปรับปรุงประสิทธิภาพ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-th">รายละเอียด *</Label>
                <Textarea
                  id="content-th"
                  value={formData.content.th}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: { ...prev.content, th: e.target.value },
                    }))
                  }
                  rows={8}
                  placeholder="รายละเอียดการอัปเดต เช่น&#10;- แก้ไขปัญหาการโหลดช้า&#10;- เพิ่มฟีเจอร์ใหม่&#10;- ปรับปรุง UI"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content (English)</CardTitle>
              <CardDescription>Title and details of the update in English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-en">Title *</Label>
                <Input
                  id="title-en"
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: { ...prev.title, en: e.target.value },
                    }))
                  }
                  placeholder="e.g. Bug fixes and performance improvements"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-en">Details *</Label>
                <Textarea
                  id="content-en"
                  value={formData.content.en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: { ...prev.content, en: e.target.value },
                    }))
                  }
                  rows={8}
                  placeholder="Update details, e.g.&#10;- Fixed slow loading issues&#10;- Added new features&#10;- Improved UI"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zh" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>内容 (中文)</CardTitle>
              <CardDescription>中文版本的更新标题和详情</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-zh">标题 *</Label>
                <Input
                  id="title-zh"
                  value={formData.title.zh}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: { ...prev.title, zh: e.target.value },
                    }))
                  }
                  placeholder="例如：错误修复和性能改进"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-zh">详情 *</Label>
                <Textarea
                  id="content-zh"
                  value={formData.content.zh}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: { ...prev.content, zh: e.target.value },
                    }))
                  }
                  rows={8}
                  placeholder="更新详情，例如：&#10;- 修复加载缓慢问题&#10;- 添加新功能&#10;- 改进用户界面"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "สร้าง Changelog" : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </form>
  )
}
