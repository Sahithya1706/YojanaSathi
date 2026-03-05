const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const maskMongoUri = (uri) => {
  if (!uri) return uri;
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, "$1****$3");
};

const testConnection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    console.log("Testing MongoDB URI:", maskMongoUri(process.env.MONGO_URI));
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected (testConnection.js)");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB test connection error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
    });
    process.exit(1);
  }
};

testConnection();
