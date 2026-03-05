const express = require("express");
const User = require("../models/User");

const router = express.Router();

const ADMIN_EMAIL = "admin@yojanasathi.gov";
const ADMIN_PASSWORD = "admin123";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, occupation, state } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      occupation: occupation || "",
      state: state || "",
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        state: user.state,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while registering user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (normalizedEmail === ADMIN_EMAIL && normalizedPassword === ADMIN_PASSWORD) {
      return res.json({
        ok: true,
        role: "admin",
        redirectTo: "/admin/dashboard",
        admin: { email: ADMIN_EMAIL },
      });
    }

    const user = await User.findOne({ email: normalizedEmail, password: normalizedPassword });
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    return res.json({
      ok: true,
      role: "user",
      redirectTo: "/dashboard",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        state: user.state,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while logging in." });
  }
});

module.exports = router;
