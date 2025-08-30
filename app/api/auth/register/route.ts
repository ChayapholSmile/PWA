import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/database/users"
import { signToken, generateSessionToken } from "@/lib/auth/jwt"
import { createSession } from "@/lib/database/users"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = "developer", language = "en" } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const user = await createUser({
      email,
      password,
      name,
      role,
      language,
      isVerified: false,
    })

    // Generate tokens
    const jwtToken = signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    const sessionToken = generateSessionToken()
    await createSession(user._id!, sessionToken)

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        isVerified: user.isVerified,
      },
    })

    response.cookies.set("auth-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
