import { Request, Response } from "express"

import { prisma } from "../helpers/prisma"

export async function followUser(
  req: Request,
  res: Response
) {
  const followingId = req.params.id as string

  if (followingId === req.userId) {
    return res.status(400).json({
      error: "Você não pode seguir você mesmo"
    })
  }

  const follow = await prisma.follow.create({
    data: {
      followerId: req.userId,
      followingId
    }
  })

  return res.status(201).json(follow)
}

export async function getFollowers(
  req: Request,
  res: Response
) {
  const id = req.params.id as string

  const followers = await prisma.follow.findMany({
    where: {
      followingId: id
    },

    include: {
      follower: true
    }
  })

  return res.json(followers)
}