import { Router } from "express"
import { createPost, getPosts, addComment } from "../controllers/posts"
import { auth } from "../middlewares/auth"

const router = Router()

router.post("/", auth, createPost)
router.get("/", getPosts)
router.post("/:postId/comments", auth, addComment)

export default router