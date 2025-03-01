// /pages/api/users.js
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nameToUse, score, gameId } = req.body;

      const username = nameToUse;

      if (!username || score === undefined) {
        return res
          .status(400)
          .json({ error: "Username and score are required" });
      }

      // Connect to MongoDB if not already connected
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
      }

      const db = mongoose.connection.db;

      // Check if username already exists
      const existingUser = await db.collection("users").findOne({ username });

      if (existingUser) {
        // Update existing user's score
        await db.collection("users").updateOne(
          { username },
          {
            $set: {
              score,
              lastPlayed: new Date(),
            },
            $inc: { gamesPlayed: 1 },
          }
        );
      } else {
        // Create new user
        await db.collection("users").insertOne({
          username,
          score,
          gamesPlayed: 1,
          created: new Date(),
          lastPlayed: new Date(),

        });
      }

      // Generate a unique game ID (we'll use MongoDB's ObjectId)
      const gameResult = await db.collection("games").insertOne({
        _id: gameId,
        username,
        score,
        playedAt: new Date(),
      });

      res.status(200).json({
        success: true,
        gameId: gameResult.insertedId.toString(),
        username,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to create/update user" });
    }
  } else if (req.method === "GET") {
    // Check if username exists and is available
    try {
      const { username } = req.query;

      if (!username) {
        return res
          .status(400)
          .json({ error: "Username parameter is required" });
      }

      // Connect to MongoDB if not already connected
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
      }

      const db = mongoose.connection.db;

      const existingUser = await db.collection("users").findOne({ username });

      res.status(200).json({
        available: !existingUser,
        user: existingUser,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to check username" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
