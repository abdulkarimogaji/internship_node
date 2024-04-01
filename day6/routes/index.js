var express = require("express");
const { getProducts } = require("../services/shopifyService");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET products page. */
router.get("/products", async (req, res, next) => {
  try {
    const products = (await getProducts()).data.products;

    console.log("prod", products[0].image.src);
    res.render("products", {
      title: "Products",
      products: products.map((p) => ({ ...p, image_src: p.image?.src })),
    });
  } catch (err) {
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

module.exports = router;
