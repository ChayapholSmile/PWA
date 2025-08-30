"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { MultiImageUpload } from "@/components/ui/multi-image-upload"
import { Loader2, X } from "lucide-react"
import type { App } from "@/lib/models/App"

interface AppFormProps {
  app?: App
  mode: "create" | "edit"
}

const categories = [
  "games",
  "business",
  "education",
  "health",
  "photography",
  "music",
  "shopping",
  "food",
  "travel",
  "art",
  "productivity",
  "social",
  "entertainment",
  "news",
  "sports",
]

export function AppForm({ app, mode }: AppFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tags, setTags] = useState<string[]>(app?.tags || [])
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    name: {
      th: app?.name.th || "",
      en: app?.name.en || "",
      zh: app?.name.zh || "",
    },
    description: {
      th: app?.description.th || "",
      en: app?.description.en || "",
      zh: app?.description.zh || "",
    },
    shortDescription: {
      th: app?.shortDescription.th || "",
      en: app?.shortDescription.en || "",
      zh: app?.shortDescription.zh || "",
    },
    category: app?.category || "",
    version: app?.version || "1.0.0",
    downloadUrl: app?.downloadUrl || "",
    websiteUrl: app?.websiteUrl || "",
    supportUrl: app?.supportUrl || "",
    size: app?.size || "",
    requirements: {
      th: app?.requirements.th || "",
      en: app?.requirements.en || "",
      zh: app?.requirements.zh || "",
    },
    icon: app?.icon || "",
    screenshots: app?.screenshots || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = mode === "create" ? "/api/apps/developer" : `/api/apps/${app?._id}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save app")
      }

      router.push("/developer/apps")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save app")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">ข้อมูลพื้นฐาน</TabsTrigger>
          <TabsTrigger value="content">เนื้อหา</TabsTrigger>
          <TabsTrigger value="media">สื่อ</TabsTrigger>
          <TabsTrigger value="details">รายละเอียด</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              <CardDescription>ข้อมูลหลักของแอปพลิเคชัน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-th">ชื่อแอป (ไทย) *</Label>
                  <Input
                    id="name-th"
                    value={formData.name.th}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: { ...prev.name, th: e.target.value },
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-en">ชื่อแอป (English) *</Label>
                  <Input
                    id="name-en"
                    value={formData.name.en}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: { ...prev.name, en: e.target.value },
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-zh">ชื่อแอป (中文) *</Label>
                  <Input
                    id="name-zh"
                    value={formData.name.zh}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: { ...prev.name, zh: e.target.value },
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">หมวดหมู่ *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">URL ดาวน์โหลด *</Label>
                <Input
                  id="downloadUrl"
                  type="url"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, downloadUrl: e.target.value }))}
                  placeholder="https://example.com/app"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>คำอธิบายสั้น</CardTitle>
              <CardDescription>คำอธิบายสั้นๆ ที่จะแสดงในรายการแอป</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short-desc-th">คำอธิบายสั้น (ไทย) *</Label>
                <Textarea
                  id="short-desc-th"
                  value={formData.shortDescription.th}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, th: e.target.value },
                    }))
                  }
                  rows={2}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-desc-en">คำอธิบายสั้น (English) *</Label>
                <Textarea
                  id="short-desc-en"
                  value={formData.shortDescription.en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, en: e.target.value },
                    }))
                  }
                  rows={2}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-desc-zh">คำอธิบายสั้น (中文) *</Label>
                <Textarea
                  id="short-desc-zh"
                  value={formData.shortDescription.zh}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, zh: e.target.value },
                    }))
                  }
                  rows={2}
                  maxLength={100}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>คำอธิบายแบบเต็ม</CardTitle>
              <CardDescription>คำอธิบายรายละเอียดของแอป</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="desc-th">คำอธิบาย (ไทย) *</Label>
                <Textarea
                  id="desc-th"
                  value={formData.description.th}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description, th: e.target.value },
                    }))
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc-en">คำอธิบาย (English) *</Label>
                <Textarea
                  id="desc-en"
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value },
                    }))
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc-zh">คำอธิบาย (中文) *</Label>
                <Textarea
                  id="desc-zh"
                  value={formData.description.zh}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: { ...prev.description, zh: e.target.value },
                    }))
                  }
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ไอคอนแอป</CardTitle>
              <CardDescription>อัปโหลดไอคอนแอป (แนะนำ 512x512 px)</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.icon}
                onChange={(base64) => setFormData((prev) => ({ ...prev, icon: base64 }))}
                onRemove={() => setFormData((prev) => ({ ...prev, icon: "" }))}
                maxWidth={512}
                maxHeight={512}
                maxSizeKB={200}
                placeholder="อัปโหลดไอคอนแอป (512x512 px)"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ภาพหน้าจอ</CardTitle>
              <CardDescription>อัปโหลดภาพหน้าจอของแอป (สูงสุด 5 รูป)</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                value={formData.screenshots}
                onChange={(screenshots) => setFormData((prev) => ({ ...prev, screenshots }))}
                maxImages={5}
                maxWidth={1920}
                maxHeight={1080}
                maxSizeKB={800}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดเพิ่มเติม</CardTitle>
              <CardDescription>ข้อมูลเพิ่มเติมของแอป</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">เว็บไซต์</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportUrl">ลิงก์ช่วยเหลือ</Label>
                  <Input
                    id="supportUrl"
                    type="url"
                    value={formData.supportUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, supportUrl: e.target.value }))}
                    placeholder="https://support.example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">ขนาดไฟล์</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                  placeholder="5.2 MB"
                />
              </div>

              <div className="space-y-2">
                <Label>แท็ก</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="เพิ่มแท็ก"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    เพิ่ม
                  </Button>
                </div>
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
          {mode === "create" ? "สร้างแอป" : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </form>
  )
}
