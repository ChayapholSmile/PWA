"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag } from "lucide-react"
import type { Changelog } from "@/lib/models/Changelog"

interface ChangelogListProps {
  appId: string
  language?: "en" | "th" | "zh"
}

export function ChangelogList({ appId, language = "th" }: ChangelogListProps) {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const response = await fetch(`/api/apps/${appId}/changelogs`)
        if (response.ok) {
          const data = await response.json()
          setChangelogs(data.changelogs)
        }
      } catch (error) {
        console.error("Failed to fetch changelogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelogs()
  }, [appId])

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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (changelogs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">ยังไม่มี Changelog</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {changelogs.map((changelog) => (
        <Card key={changelog._id?.toString()}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{changelog.title[language]}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    v{changelog.version}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(changelog.releaseDate).toLocaleDateString("th-TH")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(changelog.type)}`}>
                      {getTypeLabel(changelog.type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm">{changelog.content[language]}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
