var express = require("express");
const config = require("../config");
const stripe = require("stripe")(config.STRIPE_SECRET);
const bodyParser = require("body-parser");

var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
