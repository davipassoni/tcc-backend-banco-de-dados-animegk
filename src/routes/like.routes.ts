import { Router } from "express"

import {
  likePost,
  getPostLikes
} from "../controllers/likes"

import { auth } from "../middlewares/auth"

const router = Router()

router.post("/:id", auth, likePost)
router.get("/:id", getPostLikes)

export default router