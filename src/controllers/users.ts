import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function getProfile(req: Request, res: Response) {
  const id = req.params.id as string

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      avatar: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, posts: true } }
    }
  })

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
  return res.json(user)
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.userId!
  const { username, bio, avatar } = req.body

  const user = await prisma.user.update({
    where: { id: userId },
    data: { username, bio, avatar },
    select: { id: true, username: true, email: true, bio: true, avatar: true }
  })

  return res.json(user)
}

export async function followUser(req: Request, res: Response) {
  const followerId = req.userId!
  const followingId = req.params.id as string

  if (followerId === followingId) {
    return res.status(400).json({ error: "Você não pode seguir a si mesmo" })
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return res.json({ following: false })
  }

  await prisma.follow.create({ data: { followerId, followingId } })
  return res.json({ following: true })
}

export async function isFollowing(req: Request, res: Response) {
  const followerId = req.userId!
  const followingId = req.params.id as string

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  })

  return res.json({ following: !!existing })
}