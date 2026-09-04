import mongoose from "mongoose";

import seedData from "../seed/seeder.js";

let memServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/connectcampus";

  try {
    // Attempt standard connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database at: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to external MongoDB server (${err.message}).`);
    

 
  }

  // Auto-seed if database is freshly initialized
  try {
    await seedData();
  } catch (seedErr) {
    console.error("[Seed] Auto-seed error:", seedErr.message);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memServer) {
      await memServer.stop();
    }
  } catch (err) {
    console.error("[MongoDB] Error disconnecting:", err.message);
  }
};
