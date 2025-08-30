import { getDatabase } from "../mongodb"
import type { Changelog } from "../models/Changelog"
import { ObjectId } from "mongodb"

export async function createChangelog(
  changelogData: Omit<Changelog, "_id" | "createdAt" | "updatedAt">,
): Promise<Changelog> {
  const db = await getDatabase()
  const changelogs = db.collection<Changelog>("changelogs")

  const changelog: Changelog = {
    ...changelogData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await changelogs.insertOne(changelog)
  return { ...changelog, _id: result.insertedId }
}

export async function findChangelogsByApp(appId: string | ObjectId): Promise<Changelog[]> {
  const db = await getDatabase()
  const changelogs = db.collection<Changelog>("changelogs")
  return await changelogs
    .find({ appId: new ObjectId(appId) })
    .sort({ releaseDate: -1 })
    .toArray()
}

export async function findChangelogsByDeveloper(developerId: string | ObjectId): Promise<Changelog[]> {
  const db = await getDatabase()
  const changelogs = db.collection<Changelog>("changelogs")
  return await changelogs
    .find({ developerId: new ObjectId(developerId) })
    .sort({ releaseDate: -1 })
    .toArray()
}

export async function updateChangelog(id: string | ObjectId, updates: Partial<Changelog>): Promise<boolean> {
  const db = await getDatabase()
  const changelogs = db.collection<Changelog>("changelogs")

  const result = await changelogs.updateOne(
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

export async function deleteChangelog(id: string | ObjectId): Promise<boolean> {
  const db = await getDatabase()
  const changelogs = db.collection<Changelog>("changelogs")
  const result = await changelogs.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
