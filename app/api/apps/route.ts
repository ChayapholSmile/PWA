import { type NextRequest, NextResponse } from "next/server"
import { findApps } from "@/lib/database/apps"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"
    const sort = searchParams.get("sort") || "recent"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const category = searchParams.get("category")
    const search = searchParams.get("q")

    const filter: any = { status: "approved" }

    if (featured) {
      filter.featured = true
    }

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { "name.th": { $regex: search, $options: "i" } },
        { "name.en": { $regex: search, $options: "i" } },
        { "name.zh": { $regex: search, $options: "i" } },
        { "description.th": { $regex: search, $options: "i" } },
        { "description.en": { $regex: search, $options: "i" } },
        { "description.zh": { $regex: search, $options: "i" } },
      ]
    }

    const apps = await findApps(filter, limit, skip)

    // Sort apps based on the sort parameter
    if (sort === "popular") {
      apps.sort((a, b) => b.downloads - a.downloads)
    } else if (sort === "rating") {
      apps.sort((a, b) => b.rating - a.rating)
    } else {
      apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return NextResponse.json({ apps })
  } catch (error) {
    console.error("Get apps error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
