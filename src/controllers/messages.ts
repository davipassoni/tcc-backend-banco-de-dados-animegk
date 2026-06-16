import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function sendMessage(req: Request, res: Response) {
  const senderId = req.userId!
  const { receiverId, content } = req.body

  if (!content?.trim()) {
    return res.status(400).json({ error: "Mensagem vazia" })
  }

  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
    include: {
      sender: { select: { id: true, username: true, avatar: true } }
    }
  })

  return res.json(message)
}

export async function getConversation(req: Request, res: Response) {
  const userId = req.userId!
  const otherId = req.params.otherId as string

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, username: true, avatar: true } }
    }
  })

  return res.json(messages)
}

export async function getInbox(req: Request, res: Response) {
  const userId = req.userId!

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, username: true, avatar: true } },
      receiver: { select: { id: true, username: true, avatar: true } }
    }
  })

  const seen = new Set<string>()
  const conversations = messages.filter(m => {
    const key = [m.senderId, m.receiverId].sort().join("_")
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return res.json(conversations)
}