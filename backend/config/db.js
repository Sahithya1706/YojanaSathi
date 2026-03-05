const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      stack: error.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
