import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

const JWT_SECRET = process.env.JWT_SECRET

export interface JWTPayload {
  userId: string
  email: string
  role: "developer" | "admin"
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function generateSessionToken(): string {
  return jwt.sign({ type: "session", timestamp: Date.now() }, JWT_SECRET, { expiresIn: "7d" })
}
