var express = require("express");
const { Op, Sequelize } = require("sequelize");
const PaginationService = require("../../day1/services/PaginationService");
const {
  sqlDateFormat,
  getLastDayOfMonth,
  getFirstAndLastDayOfMonth,
} = require("../services/UtilsService");
var router = express.Router();

/* GET all. */
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

module.exports = router;
