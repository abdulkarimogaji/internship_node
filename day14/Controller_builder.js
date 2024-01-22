let fs = require("fs");
let configuration = require("./configuration.json");
const path = require("path");
const prettier = require("prettier");

const controllerTemplate = `
var express = require("express");
var router = express.Router();

/* GET all. */
router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.{{{model_name}}}.findAll();
    res.status(200).json({ error: false, list: result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

/* GET one. */
router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    const result = await db.{{{model_name}}}.findByPk(req.params.id);

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
    const result = await db.{{{model_name}}}.create({
      {{{paramsDefinition}}}
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

    await db.{{{model_name}}}.update(
      {
        {{{paramsDefinition}}}
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

    await db.{{{model_name}}}.destroy({
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


`;

function replaceVariables(str, variableObj) {
  Object.entries(variableObj).forEach(([variable, value]) => {
    str = str.replace(new RegExp(`{{{${variable}}}}`, "g"), value);
  });
  return str;
}

function Controller_builder() {
  this.build = async function () {
    const releaseFolderPath = "./release";
    try {
      if (!fs.existsSync(releaseFolderPath)) {
        fs.mkdirSync(releaseFolderPath);
      }
      const routesFolderPath = path.join(releaseFolderPath, "/routes");

      if (!fs.existsSync(routesFolderPath)) {
        fs.mkdirSync(routesFolderPath);
      }

      for (let i = 0; i < configuration.model.length; i++) {
        const model = configuration.model[i];

        const paramsDefinition = model.field
          .map((column) => {
            const [name, type, validation] = column;
            return `${name}: req.body.${name},`;
          })
          .join("");

        const fileContent = replaceVariables(controllerTemplate, {
          model_name: model.name,
          paramsDefinition,
        });

        const formattedContent = await prettier.format(fileContent, {
          parser: "babel",
        });

        fs.writeFileSync(
          path.join(routesFolderPath, model.name + ".js"),
          formattedContent
        );
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return this;
}

Controller_builder().build();
