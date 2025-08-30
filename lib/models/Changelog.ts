import type { ObjectId } from "mongodb"

export interface Changelog {
  _id?: ObjectId
  appId: ObjectId
  developerId: ObjectId
  version: string
  title: {
    en: string
    th: string
    zh: string
  }
  content: {
    en: string
    th: string
    zh: string
  }
  type: "major" | "minor" | "patch" | "hotfix"
  releaseDate: Date
  createdAt: Date
  updatedAt: Date
}
