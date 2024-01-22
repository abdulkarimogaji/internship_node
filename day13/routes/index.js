var express = require("express");
const config = require("../config");
const stripe = require("stripe")(config.STRIPE_SECRET);
const bodyParser = require("body-parser");

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
      metadata: {
        product_id: product.id,
      },
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

router.post("/webhook", bodyParser.raw({ type: "*/*" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  const db = req.app.get("db");
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    console.log("err", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      handlePaymentIntentSucceeded(event, db);
      break;
    case "payment_intent.failed":
      handlePaymentIntentFailed(event, db);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

async function handlePaymentIntentSucceeded(event, db) {
  const paymentIntent = event.data.object;
  if (paymentIntent.metadata.product_id) {
    await db.order.create({
      product_id: paymentIntent.metadata.product_id,
      status: 1,
      total: paymentIntent.amount_received / 100,
      stripe_id: paymentIntent.id,
    });
  }
}

async function handlePaymentIntentFailed(event, db) {
  const paymentIntent = event.data.object;
  if (paymentIntent.metadata.product_id) {
    await db.order.create({
      product_id: paymentIntent.metadata.product_id,
      status: 0,
      total: paymentIntent.amount_received / 100,
      stripe_id: paymentIntent.id,
    });
  }
}

module.exports = router;
