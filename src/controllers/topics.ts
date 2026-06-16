import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function getTopics(req: Request, res: Response) {
  const topics = await prisma.topic.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { replies: true } }
    }
  })
  return res.json(topics)
}

export async function getTopic(req: Request, res: Response) {
  const id = req.params.id as string

  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, username: true, avatar: true } } }
      }
    }
  })

  if (!topic) return res.status(404).json({ error: "Tópico não encontrado" })
  return res.json(topic)
}

export async function createTopic(req: Request, res: Response) {
  const { title, content, imageUrl } = req.body
  const userId = req.userId!

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: "Título e conteúdo obrigatórios" })
  }

  const topic = await prisma.topic.create({
    data: { title, content, imageUrl: imageUrl ?? null, authorId: userId },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { replies: true } }
    }
  })

  return res.json(topic)
}

export async function replyTopic(req: Request, res: Response) {
  const topicId = req.params.id as string
  const { content } = req.body
  const userId = req.userId!

  if (!content?.trim()) {
    return res.status(400).json({ error: "Resposta vazia" })
  }

  const reply = await prisma.topicReply.create({
    data: { content, topicId, authorId: userId },
    include: { author: { select: { id: true, username: true, avatar: true } } }
  })

  return res.json(reply)
}

export async function deleteTopic(req: Request, res: Response) {
  const id = req.params.id as string
  const userId = req.userId!

  const topic = await prisma.topic.findUnique({ where: { id } })
  if (!topic) return res.status(404).json({ error: "Tópico não encontrado" })
  if (topic.authorId !== userId) return res.status(403).json({ error: "Sem permissão" })

  await prisma.topicReply.deleteMany({ where: { topicId: id } })
  await prisma.topic.delete({ where: { id } })

  return res.json({ ok: true })
}
