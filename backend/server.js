const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const maskMongoUri = (uri) => {
  if (!uri) return uri;
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, "$1****$3");
};

console.log("MONGO_URI loaded:", maskMongoUri(process.env.MONGO_URI));

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
