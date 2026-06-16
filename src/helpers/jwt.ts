import jwt from "jsonwebtoken"

export function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    "anime_secret",
    {
      expiresIn: "7d"
    }
  )
}