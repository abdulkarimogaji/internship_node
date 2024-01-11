var express = require("express");
const { Op, Sequelize, sql } = require("sequelize");
const {
  sqlDateFormat,
  getFirstAndLastDayOfMonth,
} = require("../services/UtilsService");
var router = express.Router();

/* GET total_amount by search date. */
router.get("/sale", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const month = req.query.month;
    const year = req.query.year;
    const from_date = req.query.from_date;
    const to_date = req.query.to_date;

    let startDate = "0000-00-00";
    let endDate = "0000-00-00";

    if (from_date && to_date) {
      startDate = from_date;
      endDate = to_date;
    } else {
      const { firstDay, lastDay } = getFirstAndLastDayOfMonth(year, month);
      startDate = sqlDateFormat(firstDay);
      endDate = sqlDateFormat(lastDay);
    }

    const result = await db.transaction.sum("amount", {
      where: { created_at: { [Op.between]: [startDate, endDate] } },
    });

    res.status(200).json({ error: false, total_amount: result ?? 0 });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.get("/monthly", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const year = req.query.year;

    const result = (
      await db.sequelize.query(`
    SELECT
        DISTINCT MONTHNAME(created_at) AS month,
        SUM(amount) AS total_amount
    FROM
        transaction
    WHERE
        YEAR(created_at) = ${year}
    GROUP BY
        MONTHNAME(created_at)
    HAVING
        total_amount > 0
    ORDER BY MONTH(created_at);
    `)
    )[0];

    res.status(200).json({ error: false, result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const year = req.query.year;
    const user_id = req.query.user_id;

    const result = (
      await db.sequelize.query(`
    SELECT
        DISTINCT MONTHNAME(created_at) AS month,
        SUM(amount) AS total_amount
    FROM
        transaction
    WHERE
        YEAR(created_at) = ${year} AND user_id = ${user_id}
    GROUP BY
        MONTHNAME(created_at)
    HAVING
        total_amount > 0
    ORDER BY MONTH(created_at);
    `)
    )[0];

    res.status(200).json({ error: false, result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

router.get("/shipping_dock", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const year = req.query.year;
    const shipping_dock_id = req.query.shipping_dock_id;

    const result = (
      await db.sequelize.query(`
    SELECT
        DISTINCT MONTHNAME(created_at) AS month,
        SUM(amount) AS total_amount
    FROM
        transaction
    WHERE
        YEAR(created_at) = ${year} AND shipping_dock_id = ${shipping_dock_id}
    GROUP BY
        MONTHNAME(created_at)
    HAVING
        total_amount > 0
    ORDER BY MONTH(created_at);
    `)
    )[0];

    res.status(200).json({ error: false, result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
