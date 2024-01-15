var express = require("express");
const Web3Service = require("../services/Web3Service");
var router = express.Router();

/* GET all. */
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.user.findAll();
    res.status(200).json({ error: false, list: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* Create wallet */
router.post("/wallet", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const user_id = req.body.user_id;

    const result = await db.user.findByPk(user_id);

    if (!result) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const web3Service = new Web3Service();

    const { privateKey, address } = web3Service.createWallet();

    await db.user.update(
      {
        wallet_id: address,
      },
      { where: { id: user_id } }
    );

    res.status(201).json({
      error: false,
      privateKey,
      message: "Wallet created successfully",
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* Sign user. */
router.get("/sign", async (req, res, next) => {
  try {
    res.status(200).json({ error: false, model: payload });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* return balance of wallet. */
router.get("/account", async (req, res, next) => {
  try {
    res.status(200).json({ error: false, model: payload });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* Transfer */
router.get("/transfer", async (req, res, next) => {
  try {
    const web3Service = new Web3Service();

    const receipt = await web3Service.sendTransaction(
      req.query.private_key,
      req.query.to_address,
      req.query.amount
    );

    res.status(200).json({ error: false, receipt });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* GET one. */
router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.user.findByPk(req.params.id);

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
    const result = await db.user.create({
      name: req.body.name,
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

    await db.user.update(
      {
        name: req.body.name,
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

    await db.user.destroy({
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
