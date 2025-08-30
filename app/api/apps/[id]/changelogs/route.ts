import { type NextRequest, NextResponse } from "next/server"
import { findChangelogsByApp } from "@/lib/database/changelogs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const changelogs = await findChangelogsByApp(params.id)
    return NextResponse.json({ changelogs })
  } catch (error) {
    console.error("Get app changelogs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
