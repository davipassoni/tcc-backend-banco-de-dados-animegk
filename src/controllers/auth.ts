import { Request, Response } from "express"
import bcrypt from "bcrypt"

import { prisma } from "../helpers/prisma"
import { generateToken } from "../helpers/jwt"

export async function register(
  req: Request,
  res: Response
) {
  const { username, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })

  return res.status(201).json(user)
}

export async function login(
  req: Request,
  res: Response
) {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(401).json({
      error: "Usuário não encontrado"
    })
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  )

  if (!passwordMatch) {
    return res.status(401).json({
      error: "Senha inválida"
    })
  }

  const token = generateToken(user.id)

  return res.json({
    token,
    user
  })
}