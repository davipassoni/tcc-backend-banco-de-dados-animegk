import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function getAnimeRanks(req: Request, res: Response) {
  const userId = req.params.userId as string

  const ranks = await prisma.animeRank.findMany({
    where: { userId },
    orderBy: { position: "asc" }
  })

  return res.json(ranks)
}

export async function createAnimeRank(req: Request, res: Response) {
  const userId = req.userId!
  const { title, position } = req.body

  const rank = await prisma.animeRank.create({
    data: {
      title,
      position,
      userId
    }
  })

  return res.json(rank)
}

export async function updateAnimeRank(req: Request, res: Response) {
  const id = req.params.id as string
  const { title, position } = req.body

  const rank = await prisma.animeRank.update({
    where: { id },
    data: {
      title,
      position
    }
  })

  return res.json(rank)
}

export async function deleteAnimeRank(req: Request, res: Response) {
  const id = req.params.id as string

  await prisma.animeRank.delete({
    where: { id }
  })

  return res.json({ ok: true })
}