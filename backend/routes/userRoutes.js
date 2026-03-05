const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (_error) {
    return res.status(500).json({ message: "Server error while fetching users." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ message: "User deleted successfully.", user: deletedUser });
  } catch (_error) {
    return res.status(500).json({ message: "Server error while deleting user." });
  }
});

router.patch("/ban/:id", async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id).select("banned");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const nextBannedState =
      typeof req.body?.banned === "boolean" ? req.body.banned : !Boolean(existingUser.banned);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { banned: nextBannedState },
      { new: true }
    ).select("-password");

    return res.json({
      message: nextBannedState ? "User banned successfully." : "User unbanned successfully.",
      user: updatedUser,
    });
  } catch (_error) {
    return res.status(500).json({ message: "Server error while updating user ban status." });
  }
});

module.exports = router;
