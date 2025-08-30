"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChangelogList } from "@/components/changelog/changelog-list"
import { Header } from "@/components/layout/header"
import { Star, Download, Calendar, Package } from "lucide-react"
import type { App } from "@/lib/models/App"

export default function AppDetailPage() {
  const params = useParams()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await fetch(`/api/apps/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setApp(data.app)
        }
      } catch (error) {
        console.error("Failed to fetch app:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApp()
  }, [params.id])

  const handleDownload = async () => {
    if (!app) return

    // Increment download count
    await fetch(`/api/apps/${app._id}/download`, { method: "POST" })

    // Open download URL
    window.open(app.downloadUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบแอป</h1>
          <p className="text-muted-foreground">แอปที่คุณค้นหาไม่มีอยู่หรือถูกลบแล้ว</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* App Header */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                {app.icon ? (
                  <Image
                    src={`data:image/png;base64,${app.icon}`}
                    alt={app.name.th}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold mb-2">{app.name.th}</h1>
                <p className="text-lg text-muted-foreground mb-4">{app.shortDescription.th}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{app.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({app.totalRatings} รีวิว)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{app.downloads.toLocaleString()} ดาวน์โหลด</span>
                  </div>

                  <Badge variant="outline">{app.category}</Badge>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            {app.screenshots && app.screenshots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ภาพหน้าจอ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={`data:image/png;base64,${app.screenshots[currentImageIndex]}`}
                        alt={`Screenshot ${currentImageIndex + 1}`}
                        width={800}
                        height={450}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                      {app.screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image
                            src={`data:image/png;base64,${screenshot}`}
                            alt={`Screenshot ${index + 1}`}
                            width={80}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">รายละเอียด</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
                <TabsTrigger value="reviews">รีวิว</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>เกี่ยวกับแอปนี้</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap">{app.description.th}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="changelog">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">ประวัติการอัปเดต</h2>
                  </div>
                  <ChangelogList appId={app._id?.toString() || ""} />
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">ระบบรีวิวจะเปิดใช้งานเร็วๆ นี้</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <Card>
              <CardContent className="p-6">
                <Button onClick={handleDownload} size="lg" className="w-full mb-4">
                  <Download className="h-5 w-5 mr-2" />
                  ดาวน์โหลด
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">เวอร์ชัน</span>
                    <span className="font-medium">{app.version}</span>
                  </div>

                  {app.size && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ขนาด</span>
                      <span className="font-medium">{app.size}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">หมวดหมู่</span>
                    <span className="font-medium">{app.category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ผู้พัฒนา</span>
                    <span className="font-medium">{app.developer}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">อัปเดตล่าสุด</span>
                    <span className="font-medium">{new Date(app.updatedAt).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ภาษาที่รองรับ</span>
                  <span className="font-medium">ไทย, English, 中文</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">ความเข้ากันได้</span>
                  <span className="font-medium">PWA</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">อายุการใช้งาน</span>
                  <span className="font-medium">ทุกวัย</span>
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card>
              <CardHeader>
                <CardTitle>เกี่ยวกับผู้พัฒนา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{app.developer}</p>
                    <p className="text-sm text-muted-foreground">ผู้พัฒนา</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  ดูแอปอื่นๆ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
