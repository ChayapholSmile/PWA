import { getDatabase } from "../mongodb"
import type { User, UserSession } from "../models/User"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
  const db = await getDatabase()
  const users = db.collection<User>("users")

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  const user: User = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await users.insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const users = db.collection<User>("users")
  return await users.findOne({ email })
}

export async function findUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDatabase()
  const users = db.collection<User>("users")
  return await users.findOne({ _id: new ObjectId(id) })
}

export async function updateUser(id: string | ObjectId, updates: Partial<User>): Promise<boolean> {
  const db = await getDatabase()
  const users = db.collection<User>("users")

  const result = await users.updateOne(
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

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export async function createSession(userId: ObjectId, token: string): Promise<UserSession> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>("sessions")

  const session: UserSession = {
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdAt: new Date(),
  }

  const result = await sessions.insertOne(session)
  return { ...session, _id: result.insertedId }
}

export async function findSessionByToken(token: string): Promise<UserSession | null> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>("sessions")
  return await sessions.findOne({
    token,
    expiresAt: { $gt: new Date() },
  })
}

export async function deleteSession(token: string): Promise<boolean> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>("sessions")
  const result = await sessions.deleteOne({ token })
  return result.deletedCount > 0
}
