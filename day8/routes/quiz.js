var express = require("express");
var router = express.Router();

/* GET all. */
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.quiz.findAll({ include: db.quiz_answer });
    res.status(200).json({ error: false, list: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* ADD one. */
router.post("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const quiz = await db.quiz.create({
      question: req.body.question,
      correct_answer: req.body.correct_answer,
    });

    await db.quiz_answer.bulkCreate(
      req.body.answers.map((a) => ({ quiz_id: quiz.id, answer: a }))
    );

    res.status(201).json({ error: false, model: quiz });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
