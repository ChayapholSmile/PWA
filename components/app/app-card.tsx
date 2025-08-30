"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, ExternalLink } from "lucide-react"
import type { App } from "@/lib/models/App"

interface AppCardProps {
  app: App
  language?: "en" | "th" | "zh"
}

export function AppCard({ app, language = "th" }: AppCardProps) {
  const handleDownload = async () => {
    // Increment download count
    await fetch(`/api/apps/${app._id}/download`, { method: "POST" })

    // Open download URL
    window.open(app.downloadUrl, "_blank")
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {app.icon ? (
              <Image
                src={`data:image/png;base64,${app.icon}`}
                alt={app.name[language]}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{app.name[language].charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link href={`/apps/${app._id}`}>
                  <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
                    {app.name[language]}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{app.shortDescription[language]}</p>
              </div>

              {app.featured && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  แนะนำ
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{app.rating.toFixed(1)}</span>
                <span>({app.totalRatings})</span>
              </div>

              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{app.downloads.toLocaleString()}</span>
              </div>

              <Badge variant="outline" className="text-xs">
                {app.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button onClick={handleDownload} size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลด
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/apps/${app._id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
