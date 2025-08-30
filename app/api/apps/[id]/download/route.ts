import { type NextRequest, NextResponse } from "next/server"
import { incrementDownloads } from "@/lib/database/apps"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await incrementDownloads(params.id)
    return NextResponse.json({ message: "Download count incremented" })
  } catch (error) {
    console.error("Increment download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
