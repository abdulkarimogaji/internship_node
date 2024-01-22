var express = require("express");
const stripe = require("stripe")(
  "sk_test_51Ll5ukBgOlWo0lDU83gVbZQHnEFerz8t1BfWdhljzwP1CBNsqa6HRXwMm7fQrYYMHC1F2M0WyGOvZLmInXTE9nE900EgqSdmn6"
);

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

/* product view page */
router.get("/products/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const product = await db.product.findOne({ where: { id: req.params.id } });

    res.render("product-view", {
      title: product.title,
      product,
    });
  } catch (err) {
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

/* Create payment intent */
router.post("/products/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const product = await db.product.findOne({ where: { id: req.params.id } });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: "usd",
    });
    res.render("product-view", {
      title: "Checkout",
      product,
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

router.get("/products/:id/payment-complete", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const product = await db.product.findOne({ where: { id: req.params.id } });
    const clientSecret = req.query.payment_intent;
    if (!clientSecret) {
      return res.render("product-view", {
        title: product.title,
        product,
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
    let message = "";

    switch (paymentIntent.status) {
      case "succeeded":
        message = "Success! Payment received.";
        break;

      case "processing":
        message =
          "Payment processing. We'll update you when payment is received.";
        break;

      case "requires_payment_method":
        message = "Payment failed. Please try another payment method.";
        break;

      default:
        message = "Something went wrong.";
        break;
    }

    res.render("payment-status", {
      title: message,
      product,
      message,
      ordered_at: new Date(paymentIntent.created * 1000).toDateString(),
      success: paymentIntent.status == "succeeded",
    });
  } catch (err) {
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

module.exports = router;
