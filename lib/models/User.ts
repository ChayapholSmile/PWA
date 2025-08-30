import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "developer" | "admin"
  avatar?: string // Base64 encoded image
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  language: "en" | "th" | "zh"
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  token: string
  expiresAt: Date
  createdAt: Date
}
