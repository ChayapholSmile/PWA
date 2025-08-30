export interface ImageValidationResult {
  isValid: boolean
  error?: string
  compressedFile?: File
}

export async function validateAndCompressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    maxSizeKB?: number
    quality?: number
    allowedTypes?: string[]
  } = {},
): Promise<ImageValidationResult> {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    maxSizeKB = 500,
    quality = 0.8,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  } = options

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `ประเภทไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ ${allowedTypes.map((type) => type.split("/")[1]).join(", ")}`,
    }
  }

  // Check file size
  if (file.size > maxSizeKB * 1024) {
    return {
      isValid: false,
      error: `ไฟล์ใหญ่เกินไป ขนาดสูงสุด ${maxSizeKB} KB`,
    }
  }

  try {
    const compressedFile = await compressImage(file, { maxWidth, maxHeight, quality })
    return {
      isValid: true,
      compressedFile,
    }
  } catch (error) {
    return {
      isValid: false,
      error: "เกิดข้อผิดพลาดในการประมวลผลภาพ",
    }
  }
}

export function compressImage(
  file: File,
  options: {
    maxWidth: number
    maxHeight: number
    quality: number
  },
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      const { maxWidth, maxHeight } = options

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error("Failed to compress image"))
          }
        },
        file.type,
        options.quality,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:image/...;base64, prefix
      const base64Data = result.split(",")[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new File([byteArray], filename, { type: mimeType })
}
