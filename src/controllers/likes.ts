import { Request, Response } from "express"

import { prisma } from "../helpers/prisma"

export async function likePost(
  req: Request,
  res: Response
) {
  const postId = req.params.id as string

  const like = await prisma.like.create({
    data: {
      userId: req.userId,
      postId
    }
  })

  return res.status(201).json(like)
}

export async function getPostLikes(
  req: Request,
  res: Response
) {
  const postId = req.params.id as string

  const likes = await prisma.like.count({
    where: {
      postId
    }
  })

  return res.json({
    likes
  })
}