import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface TokenPayload {
  userId: string
}

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(
      token,
      "anime_secret"
    ) as TokenPayload

    req.userId = decoded.userId

    next()
  } catch {
    return res.status(401).json({
      error: "Token inválido"
    })
  }
}