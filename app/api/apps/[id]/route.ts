import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { findAppById, updateApp, deleteApp } from "@/lib/database/apps"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const app = await findAppById(params.id)

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    return NextResponse.json({ app })
  } catch (error) {
    console.error("Get app error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const PUT = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const app = await findAppById(params.id)

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    // Check if user owns the app or is admin
    if (app.developerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updates = await request.json()

    // If status is being changed, only admins can do it
    if (updates.status && user.role !== "admin") {
      delete updates.status
    }

    const success = await updateApp(params.id, updates)

    if (!success) {
      return NextResponse.json({ error: "Failed to update app" }, { status: 500 })
    }

    const updatedApp = await findAppById(params.id)
    return NextResponse.json({ app: updatedApp })
  } catch (error) {
    console.error("Update app error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const app = await findAppById(params.id)

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 })
    }

    // Check if user owns the app or is admin
    if (app.developerId.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const success = await deleteApp(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete app" }, { status: 500 })
    }

    return NextResponse.json({ message: "App deleted successfully" })
  } catch (error) {
    console.error("Delete app error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
