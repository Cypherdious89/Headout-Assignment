// pages/api/destinations.js
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Access the specific database and collection
    const db = mongoose.connection.db;
    const destinationsCollection = db.collection("destinations");

    // Get all destinations from the collection
    const destinations = await destinationsCollection.find({}).toArray();

    res.status(200).json(destinations);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "Failed to fetch destinations: " + e.message });
  }
}
