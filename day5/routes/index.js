var express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
var router = express.Router();
const multer = require("multer");
const stream = require("stream");
const upload = multer();

function parseCSV(fileBuffer) {
  const results = [];
  return new Promise((resolve, reject) => {
    try {
      const readableStream = new stream.Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream
        .pipe(csv())
        .on("data", (data) => {
          console.log("d", data);
          results.push(data);
        })
        .on("end", () => {
          console.log("ending", results.length);
          resolve(results);
        });
    } catch (err) {
      reject(err);
    }
  });
}

function writeCSV(filename, data) {
  return new Promise((resolve, reject) => {
    const writableStream = fs.createWriteStream(filename);
    const readableStream = new stream.Readable();
    readableStream.push(
      data.map((obj) => Object.values(obj).join(",")).join("\n")
    );
    readableStream.push(null);

    readableStream
      .pipe(writableStream)
      .on("finish", () => {
        resolve(filename);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET import page. */
router.get("/import", function (req, res, next) {
  res.render("import", { title: "Day 5: Import page" });
});

/* Submit import page. */
router.post("/api/v1/import", upload.single("file"), async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const transactions = await parseCSV(req.file.buffer);

    const results = await Promise.all(
      transactions.map((t) =>
        db.transaction.create({
          id: t.id,
          user_id: t.user_id,
          shipping_dock_id: t.shipping_dock_id,
          order_id: t.order_id,
          tax: t.tax,
          amount: t.amount,
          discount: t.discount,
          total: t.total,
          notes: t.notes,
          status: t.status,
        })
      )
    );

    res.render("import_response", {
      title: "Upload successful",
      message: `${results.length} transactions saved successfully`,
    });
  } catch (err) {
    res.render("import_response", { title: "An Error occurred", message: err });
  }
});

router.post("/api/v1/export", async (req, res, next) => {
  try {
    const db = req.app.get("db");

    const transactions = await db.transaction.findAll();

    await writeCSV(
      "output.csv",
      transactions.map((t) => ({
        id: t.id,
        user_id: t.user_id,
        shipping_dock_id: t.shipping_dock_id,
        order_id: t.order_id,
        tax: t.tax,
        amount: t.amount,
        discount: t.discount,
        total: t.total,
        notes: t.notes,
        status: t.status,
      }))
    );

    res.download("output.csv", "output.csv", (err) => {
      if (!err) {
        fs.unlinkSync("output.csv");
      }
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "An error occurred" });
  }
});

module.exports = router;
