import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { updateChangelog, deleteChangelog } from "@/lib/database/changelogs"
import { ObjectId } from "mongodb"

export const PUT = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const { getDatabase } = await import("@/lib/mongodb")
    const db = await getDatabase()
    const changelogs = db.collection("changelogs")

    const changelog = await changelogs.findOne({ _id: new ObjectId(params.id) })

    if (!changelog) {
      return NextResponse.json({ error: "Changelog not found" }, { status: 404 })
    }

    // Check if user owns the changelog or is admin
    if (changelog.developerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updates = await request.json()

    if (updates.releaseDate) {
      updates.releaseDate = new Date(updates.releaseDate)
    }

    const success = await updateChangelog(params.id, updates)

    if (!success) {
      return NextResponse.json({ error: "Failed to update changelog" }, { status: 500 })
    }

    const updatedChangelog = await changelogs.findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ changelog: updatedChangelog })
  } catch (error) {
    console.error("Update changelog error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const { getDatabase } = await import("@/lib/mongodb")
    const db = await getDatabase()
    const changelogs = db.collection("changelogs")

    const changelog = await changelogs.findOne({ _id: new ObjectId(params.id) })

    if (!changelog) {
      return NextResponse.json({ error: "Changelog not found" }, { status: 404 })
    }

    // Check if user owns the changelog or is admin
    if (changelog.developerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const success = await deleteChangelog(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete changelog" }, { status: 500 })
    }

    return NextResponse.json({ message: "Changelog deleted successfully" })
  } catch (error) {
    console.error("Delete changelog error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
