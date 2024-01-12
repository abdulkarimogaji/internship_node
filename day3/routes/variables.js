var express = require("express");
var router = express.Router();

/* GET all. */
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.variables.findAll();
    res.status(200).json({ error: false, list: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* GET one. */
router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.variables.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({ error: true, message: "Not found" });
    }
    res.status(200).json({ error: false, model: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* ADD one. */
router.post("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.variables.create({
      name: req.body.name,
      type: req.body.type,
    });

    res.status(201).json({ error: false, model: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* update one. */
router.put("/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    await db.variables.update(
      {
        name: req.body.name,
        type: req.body.type,
      },
      { where: { id: req.params.id } }
    );

    res.status(200).json({ error: false, message: "Update successful" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* delete one. */
router.delete("/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    await db.variables.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ error: false, message: "Delete successful" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
