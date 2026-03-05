const express = require("express");
const { deleteUser, getUsers, toggleBan } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.patch("/ban/:id", toggleBan);

module.exports = router;
