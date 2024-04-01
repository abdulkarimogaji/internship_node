var express = require("express");
const TreeQL = require("../services/TreeQL");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/records/:table", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.ListRecord(db, req.params.table, req.query);
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.get("/records/:table/:id", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.ReadRecord(
      db,
      req.params.table,
      req.params.id
    );
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.post("/records/:table", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.CreateRecord(db, req.params.table, req.body);
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.put("/records/:table/:id", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.UpdateRecord(
      db,
      req.params.table,
      req.body,
      req.params.id
    );
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.patch("/records/:table/:id", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.PatchRecord(
      db,
      req.params.table,
      req.body,
      req.params.id
    );
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.delete("/records/:table/:id", async (req, res) => {
  try {
    const db = req.app.get("db");
    const response = await TreeQL.DeleteRecord(
      db,
      req.params.table,
      req.params.id
    );
    return res.json({ response });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
