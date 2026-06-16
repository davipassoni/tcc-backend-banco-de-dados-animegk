import { Router } from "express"
import { getTopics, getTopic, createTopic, replyTopic, deleteTopic } from "../controllers/topics"
import { auth } from "../middlewares/auth"

const router = Router()

router.get("/", getTopics)
router.get("/:id", getTopic)
router.post("/", auth, createTopic)
router.post("/:id/replies", auth, replyTopic)
router.delete("/:id", auth, deleteTopic)

export default router
