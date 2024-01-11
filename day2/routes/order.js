var express = require("express");
const { Op, Sequelize } = require("sequelize");
const PaginationService = require("../../day1/services/PaginationService");
var router = express.Router();

/* GET all. */
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const { limit, offset, order } = PaginationService.parseQuery(req.query);

    const { count, rows } = await db.order.findAndCountAll({
      limit,
      offset,
      order,
    });

    const { total, page, list, num_pages } = PaginationService.getPageData(
      count,
      rows,
      limit,
      offset
    );

    res.status(200).json({ error: false, total, page, list, num_pages });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* GET paginate cursor method. */
router.get("/cursor", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const { limit } = PaginationService.parseQuery(req.query);
    // get cursor
    let cursorId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    cursorId = Number(cursorId) || 0;

    const result = await db.order.findAll({
      limit: limit,
      where: {
        id: {
          [Op.gt]: cursorId,
        },
      },
    });

    const next_cursor = result[result.length - 1]?.id || 0;

    res.status(200).json({ error: false, list: result, next_cursor });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

// (Return all odd order_id rows)
router.get("/odd", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.order.findAll({
      where: {
        id: {
          [Op.and]: [{ [Op.not]: null }, Sequelize.literal("(id % 2 = 1)")],
        },
      },
    });
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
    const result = await db.order.findByPk(req.params.id);

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
    const result = await db.order.create({
      user_id: req.body.user_id,
      amount: req.body.amount,
      tax: req.body.tax,
      notes: req.body.notes,
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

    await db.order.update(
      {
        user_id: req.body.user_id,
        amount: req.body.amount,
        tax: req.body.tax,
        notes: req.body.notes,
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

    await db.order.destroy({
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
