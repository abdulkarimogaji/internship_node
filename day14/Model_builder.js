let fs = require("fs");
let configuration = require("./configuration.json");
const path = require("path");
const prettier = require("prettier");

const modelTemplate = `
module.exports = (sequelize, DataTypes) => {
  const {{{model_name}}} = sequelize.define(
    "{{{model_name}}}",
    {
     {{{fieldsDefinition}}}
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "{{{model_name}}}",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return {{{model_name}}};
};

`;

function replaceVariables(str, variableObj) {
  Object.entries(variableObj).forEach(([variable, value]) => {
    str = str.replace(new RegExp(`{{{${variable}}}}`, "g"), value);
  });
  return str;
}

function Model_builder() {
  let config = fs.readFileSync("configuration.json");

  this.build = async function () {
    const releaseFolderPath = "./release";
    try {
      if (fs.existsSync(releaseFolderPath)) {
        fs.rmSync(releaseFolderPath, { recursive: true });
      }
      fs.mkdirSync(releaseFolderPath);
      const modelFolderPath = path.join(releaseFolderPath, "/models");
      fs.mkdirSync(modelFolderPath);

      for (let i = 0; i < configuration.model.length; i++) {
        const model = configuration.model[i];

        const fieldsDefinition = model.field
          .map((column) => {
            const [name, type, validation] = column;
            if (name == "id") {
              return `id: {
                  type: DataTypes.${type.toUpperCase()},
                  primaryKey: true,
                  autoIncrement: true,
                },`;
            }

            if (validation == "required") {
              return `${name}: {
                  type: DataTypes.${type.toUpperCase()},
                  allowNull: false,
                },`;
            }

            return `${name}: DataTypes.${type.toUpperCase()},`;
          })
          .join("");

        const fileContent = replaceVariables(modelTemplate, {
          model_name: model.name,
          fieldsDefinition,
        });

        const formattedContent = await prettier.format(fileContent, {
          parser: "babel",
        });

        fs.writeFileSync(
          path.join(modelFolderPath, model.name + ".js"),
          formattedContent
        );
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return this;
}

Model_builder().build();
