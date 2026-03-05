const express = require("express");
const { getQuizAttempts } = require("../controllers/quizController");

const router = express.Router();

router.get("/", getQuizAttempts);

module.exports = router;
