var express = require("express");
var router = express.Router();
var { Op } = require("sequelize");

function replaceVariables(str, variableObj) {
  Object.entries(variableObj).forEach(([variable, value]) => {
    str = str.replace(`${variable}`, value);
  });
  return str;
}

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.get("db");
    // parse base64
    const base64String = req.query.base64;
    let variablesObj = null;

    try {
      variablesObj = JSON.parse(atob(base64String));
    } catch (err) {
      return res.status(400).json({ error: true, message: "Invalid base 64" });
    }
    const rules = await db.rules.findAll();
    const variables = await db.variables.findAll({
      where: { name: { [Op.in]: Object.keys(variablesObj) } },
    });

    const substitutableVariables = variables.reduce((a, c) => {
      // cast variable type to match DB
      if (c.type == "STRING") {
        a[c.name] = String(variablesObj[c.name]);
      } else if (c.type == "FLOAT") {
        a[c.name] = Number(variablesObj[c.name]);
      } else if (c.type == "INTEGER") {
        a[c.name] = Number(variablesObj[c.name]);
      } else {
        // no type
        return a;
      }
      return a;
    }, {});

    const result = rules
      .map((rule) => {
        const conditionStr = replaceVariables(
          rule.condition,
          substitutableVariables
        );
        console.log("con", conditionStr);
        // evaluate condition
        if (eval(conditionStr) === true) {
          return { rule_id: rule.id, action: rule.action };
        }
        return false;
      })
      .filter((v) => v);

    res.status(200).json({ message: "Evaluation complete", result });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
