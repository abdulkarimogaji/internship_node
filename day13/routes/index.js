var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Express" });
});

/* GET products page. */
router.get("/products", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const products = await db.product.findAll();
    res.render("products", { title: "Products", products });
  } catch (err) {
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

module.exports = router;
