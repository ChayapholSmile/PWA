import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { createChangelog, findChangelogsByDeveloper } from "@/lib/database/changelogs"

export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get("appId")

    let changelogs
    if (appId) {
      const { findChangelogsByApp } = await import("@/lib/database/changelogs")
      changelogs = await findChangelogsByApp(appId)
    } else {
      changelogs = await findChangelogsByDeveloper(user._id)
    }

    return NextResponse.json({ changelogs })
  } catch (error) {
    console.error("Get changelogs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const changelogData = await request.json()

    // Validate required fields
    const requiredFields = ["appId", "version", "title", "content", "type", "releaseDate"]
    for (const field of requiredFields) {
      if (!changelogData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Verify app ownership
    const { findAppById } = await import("@/lib/database/apps")
    const app = await findAppById(changelogData.appId)

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    if (app.developerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create changelog
    const changelog = await createChangelog({
      ...changelogData,
      developerId: user._id,
      releaseDate: new Date(changelogData.releaseDate),
    })

    return NextResponse.json({ changelog })
  } catch (error) {
    console.error("Create changelog error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
