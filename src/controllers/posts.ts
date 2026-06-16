import { Request, Response } from "express"
import { prisma } from "../helpers/prisma"

export async function createPost(req: Request, res: Response) {
  const { content, imageUrl } = req.body
  const userId = req.userId!

  if (!content?.trim() && !imageUrl) {
    return res.status(400).json({ error: "Post vazio" })
  }

  const post = await prisma.post.create({
    data: {
      content: content ?? "",
      imageUrl: imageUrl ?? null,
      authorId: userId
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: true,
      comments: {
        include: { author: { select: { id: true, username: true, avatar: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  return res.json(post)
}

export async function getPosts(req: Request, res: Response) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: true,
      comments: {
        include: { author: { select: { id: true, username: true, avatar: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  return res.json(posts)
}

export async function addComment(req: Request, res: Response) {
  const postId = req.params.postId as string
  const { content } = req.body
  const userId = req.userId!

  if (!content?.trim()) {
    return res.status(400).json({ error: "Comentário vazio" })
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } }
    }
  })

  return res.json(comment)
}