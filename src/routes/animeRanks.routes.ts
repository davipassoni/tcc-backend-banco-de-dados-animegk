import { Router } from "express"
import {
  getAnimeRanks,
  createAnimeRank,
  updateAnimeRank,
  deleteAnimeRank
} from "../controllers/animeRanks"

import { auth } from "../middlewares/auth"

const router = Router()

router.get("/:userId", getAnimeRanks)
router.post("/", auth, createAnimeRank)
router.put("/:id", auth, updateAnimeRank)
router.delete("/:id", auth, deleteAnimeRank)

export default router