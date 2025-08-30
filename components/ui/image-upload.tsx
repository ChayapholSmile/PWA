"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Loader2 } from "lucide-react"
import { validateAndCompressImage, fileToBase64 } from "@/lib/utils/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string // Base64 string
  onChange: (base64: string) => void
  onRemove?: () => void
  maxWidth?: number
  maxHeight?: number
  maxSizeKB?: number
  quality?: number
  allowedTypes?: string[]
  className?: string
  placeholder?: string
  multiple?: boolean
  accept?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  maxWidth = 1024,
  maxHeight = 1024,
  maxSizeKB = 500,
  quality = 0.8,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
  placeholder = "คลิกเพื่ออัปโหลดภาพ หรือลากไฟล์มาวาง",
  multiple = false,
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      setError("")
      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90))
        }, 100)

        const validation = await validateAndCompressImage(file, {
          maxWidth,
          maxHeight,
          maxSizeKB,
          quality,
          allowedTypes,
        })

        clearInterval(progressInterval)

        if (!validation.isValid) {
          setError(validation.error || "เกิดข้อผิดพลาดในการอัปโหลด")
          setUploadProgress(0)
          return
        }

        const base64 = await fileToBase64(validation.compressedFile || file)
        setUploadProgress(100)
        onChange(base64)

        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการอัปโหลด")
        setUploadProgress(0)
      } finally {
        setIsUploading(false)
      }
    },
    [maxWidth, maxHeight, maxSizeKB, quality, allowedTypes, onChange],
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

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setError("")
    onRemove?.()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value ? (
        <Card className="relative group">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={`data:image/png;base64,${value}`}
                alt="Uploaded image"
                className="w-full h-auto max-h-64 object-contain rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="w-full max-w-xs">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">กำลังอัปโหลด... {uploadProgress}%</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{placeholder}</p>
                    <p className="text-xs text-muted-foreground">
                      รองรับไฟล์ {allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} ขนาดสูงสุด{" "}
                      {maxSizeKB} KB
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
