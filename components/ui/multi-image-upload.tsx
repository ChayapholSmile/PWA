"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { validateAndCompressImage, fileToBase64 } from "@/lib/utils/image"
import { cn } from "@/lib/utils"

interface MultiImageUploadProps {
  value: string[] // Array of Base64 strings
  onChange: (images: string[]) => void
  maxImages?: number
  maxWidth?: number
  maxHeight?: number
  maxSizeKB?: number
  quality?: number
  allowedTypes?: string[]
  className?: string
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  maxWidth = 1024,
  maxHeight = 1024,
  maxSizeKB = 500,
  quality = 0.8,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      if (value.length >= maxImages) {
        setError(`สามารถอัปโหลดได้สูงสุด ${maxImages} รูป`)
        return
      }

      setError("")
      setIsUploading(true)

      try {
        const newImages: string[] = []

        for (let i = 0; i < Math.min(files.length, maxImages - value.length); i++) {
          const file = files[i]

          const validation = await validateAndCompressImage(file, {
            maxWidth,
            maxHeight,
            maxSizeKB,
            quality,
            allowedTypes,
          })

          if (!validation.isValid) {
            setError(validation.error || "เกิดข้อผิดพลาดในการอัปโหลด")
            continue
          }

          const base64 = await fileToBase64(validation.compressedFile || file)
          newImages.push(base64)
        }

        if (newImages.length > 0) {
          onChange([...value, ...newImages])
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการอัปโหลด")
      } finally {
        setIsUploading(false)
      }
    },
    [value, onChange, maxImages, maxWidth, maxHeight, maxSizeKB, quality, allowedTypes],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
    setError("")
  }

  const canAddMore = value.length < maxImages

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ภาพหน้าจอ</span>
          <Badge variant="secondary">
            {value.length}/{maxImages}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((image, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-2">
              <div className="relative aspect-video">
                <img
                  src={`data:image/png;base64,${image}`}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {canAddMore && (
          <Card
            className={cn(
              "border-2 border-dashed transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = "image/*"
              input.multiple = true
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement
                handleFileSelect(target.files)
              }
              input.click()
            }}
          >
            <CardContent className="p-4">
              <div className="aspect-video flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">เพิ่มภาพ</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        รองรับไฟล์ {allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} ขนาดสูงสุด {maxSizeKB} KB ต่อรูป
      </p>
    </div>
  )
}
