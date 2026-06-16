import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes"
import postRoutes from "./routes/post.routes"
import userRoutes from "./routes/user.routes"
import followRoutes from "./routes/follow.routes"
import likeRoutes from "./routes/like.routes"
import messageRoutes from "./routes/messages.routes"
import topicRoutes from "./routes/topics.routes"
import animeRanksRoutes from "./routes/animeRanks.routes"

const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))

app.use("/auth", authRoutes)
app.use("/posts", postRoutes)
app.use("/users", userRoutes)
app.use("/follow", followRoutes)
app.use("/likes", likeRoutes)
app.use("/messages", messageRoutes)
app.use("/topics", topicRoutes)
app.use("/anime-ranks", animeRanksRoutes)

app.get("/", (req, res) => {
  return res.json({
    message: "AnimeGeek API "
  })
})

export default app