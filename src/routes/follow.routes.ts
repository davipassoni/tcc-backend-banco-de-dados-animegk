import { Router } from "express"

import {
  followUser,
  getFollowers
} from "../controllers/follows"

import { auth } from "../middlewares/auth"

const router = Router()

router.post("/:id", auth, followUser)
router.get("/:id/followers", getFollowers)

export default router