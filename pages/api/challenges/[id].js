// /pages/api/challenges/[id].js
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  // Use the id as string directly, no need to convert
  const gameId = id.toString();

  if (!id) {
    return res.status(400).json({ error: "Challenge ID is required" });
  }

  try {
    // Connect to MongoDB if not already connected, using mongoose like in users.js
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const db = mongoose.connection.db;

    // Find the game with the provided ID
    const game = await db.collection("games").findOne({ _id: gameId });

    if (!game) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Get the challenger's user information
    const user = await db
      .collection("users")
      .findOne({ username: game.username });

    res.status(200).json({
      challengeInfo: {
        username: game.username,
        score: game.score,
        playedAt: game.playedAt,
        fromId: gameId, // Include the original gameId for reference
      },
      userInfo: user
        ? {
            username: user.username,
            gamesPlayed: user.gamesPlayed,
          }
        : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch challenge information" });
  }
}