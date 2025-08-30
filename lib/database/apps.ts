import { getDatabase } from "../mongodb"
import type { App, AppRating } from "../models/App"
import { ObjectId } from "mongodb"

export async function createApp(
  appData: Omit<App, "_id" | "createdAt" | "updatedAt" | "rating" | "totalRatings" | "downloads">,
): Promise<App> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")

  const app: App = {
    ...appData,
    rating: 0,
    totalRatings: 0,
    downloads: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await apps.insertOne(app)
  return { ...app, _id: result.insertedId }
}

export async function findAppById(id: string | ObjectId): Promise<App | null> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")
  return await apps.findOne({ _id: new ObjectId(id) })
}

export async function findAppsByDeveloper(developerId: string | ObjectId): Promise<App[]> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")
  return await apps.find({ developerId: new ObjectId(developerId) }).toArray()
}

export async function findApps(filter: any = {}, limit = 20, skip = 0): Promise<App[]> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")
  return await apps.find(filter).limit(limit).skip(skip).sort({ createdAt: -1 }).toArray()
}

export async function updateApp(id: string | ObjectId, updates: Partial<App>): Promise<boolean> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")

  const result = await apps.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteApp(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")
  const result = await apps.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function incrementDownloads(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase()
  const apps = db.collection<App>("apps")

  const result = await apps.updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { downloads: 1 },
      $set: { updatedAt: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function addRating(ratingData: Omit<AppRating, "_id" | "createdAt">): Promise<AppRating> {
  const db = await getDatabase()
  const ratings = db.collection<AppRating>("ratings")

  const rating: AppRating = {
    ...ratingData,
    createdAt: new Date(),
  }

  const result = await ratings.insertOne(rating)

  // Update app rating
  await updateAppRating(ratingData.appId)

  return { ...rating, _id: result.insertedId }
}

async function updateAppRating(appId: ObjectId): Promise<void> {
  const db = await getDatabase()
  const ratings = db.collection<AppRating>("ratings")
  const apps = db.collection<App>("apps")

  const ratingStats = await ratings
    .aggregate([
      { $match: { appId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])
    .toArray()

  if (ratingStats.length > 0) {
    const { avgRating, totalRatings } = ratingStats[0]
    await apps.updateOne(
      { _id: appId },
      {
        $set: {
          rating: Math.round(avgRating * 10) / 10,
          totalRatings,
          updatedAt: new Date(),
        },
      },
    )
  }
}
