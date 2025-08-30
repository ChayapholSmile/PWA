import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { createApp, findAppsByDeveloper } from "@/lib/database/apps"

export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const apps = await findAppsByDeveloper(user._id)
    return NextResponse.json({ apps })
  } catch (error) {
    console.error("Get developer apps error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const appData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "shortDescription", "category", "version", "downloadUrl"]
    for (const field of requiredFields) {
      if (!appData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create app
    const app = await createApp({
      ...appData,
      developerId: user._id,
      status: "pending",
      featured: false,
    })

    return NextResponse.json({ app })
  } catch (error) {
    console.error("Create app error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
