import { Router } from "express"

import {
  sendMessage,
  getConversation,
  getInbox
} from "../controllers/messages"

import { auth } from "../middlewares/auth"

const router = Router()

router.post("/", auth, sendMessage)
router.get("/inbox", auth, getInbox)
router.get("/:otherId", auth, getConversation)

export default router