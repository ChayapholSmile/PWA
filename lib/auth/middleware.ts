import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./jwt"
import { findUserById } from "../database/users"

export async function authenticateUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await findUserById(payload.userId)
  return user
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(request, user)
  }
}

export function requireRole(role: "developer" | "admin") {
  return (handler: (request: NextRequest, user: any) => Promise<NextResponse>) => async (request: NextRequest) => {
    const user = await authenticateUser(request)

    if (!user || user.role !== role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return handler(request, user)
  }
}
