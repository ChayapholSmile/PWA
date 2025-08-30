import type { ObjectId } from "mongodb"

export interface App {
  _id?: ObjectId
  developerId: ObjectId
  name: {
    en: string
    th: string
    zh: string
  }
  description: {
    en: string
    th: string
    zh: string
  }
  shortDescription: {
    en: string
    th: string
    zh: string
  }
  category: string
  version: string
  icon: string // Base64 encoded image
  screenshots: string[] // Array of Base64 encoded images
  downloadUrl: string
  websiteUrl?: string
  supportUrl?: string
  rating: number
  totalRatings: number
  downloads: number
  size: string
  requirements: {
    en: string
    th: string
    zh: string
  }
  tags: string[]
  status: "pending" | "approved" | "rejected" | "suspended"
  featured: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface AppRating {
  _id?: ObjectId
  appId: ObjectId
  userId: ObjectId
  rating: number
  review?: {
    en?: string
    th?: string
    zh?: string
  }
  createdAt: Date
}
