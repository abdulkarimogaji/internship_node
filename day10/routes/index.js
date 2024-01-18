var express = require("express");
var path = require("path");
const {
  generateQRImage,
  readFileContent,
  replaceVariables,
  generatePDF,
} = require("../services/UtilService");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

/* GET Code page. */
router.get("/code", (req, res, next) => {
  res.render("code", {
    title: "Generate invoice",
    qrCode: "",
    amount: "",
    service: "",
  });
});

/* POST Code page. */
router.post("/code", async (req, res, next) => {
  try {
    const src = await generateQRImage(
      `http://localhost:3000/api/v1/code?amount=${req.body.amount}&service=${req.body.service}`
    );

    res.render("code", {
      title: "Scan code",
      qrCode: src,
      amount: req.body.amount,
      service: req.body.service,
    });
  } catch (err) {
    console.log("err", err);
    res.render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

/* Download invoice page. */
router.get("/code", (req, res, next) => {
  res.render("code", {
    title: "Generate invoice",
    qrCode: "",
    amount: "",
    service: "",
  });
});

/* GET Code page. */
router.get("/api/v1/code", async (req, res, next) => {
  try {
    const template = await readFileContent(
      path.join(__dirname, `../invoice.html`)
    );
    const invoiceStr = replaceVariables(template, {
      amount: req.query.amount,
      service: req.query.service,
    });

    const pdfBuffer = await generatePDF(invoiceStr);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

    res.end(pdfBuffer);
  } catch (err) {
    console.log("err", err);
    res.status(500).render("error", {
      message: "An error occurred",
      error: { status: 500, stack: err },
    });
  }
});

module.exports = router;
