/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * credential Model
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require("moment");
const { Op } = require("sequelize");
const { intersection } = require("lodash");
const coreModel = require("../core/models");

module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define(
    "director",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "director",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Director);

  Director._preCreateProcessing = function (data) {
    return data;
  };
  Director._postCreateProcessing = function (data) {
    return data;
  };
  Director._customCountingConditions = function (data) {
    return data;
  };

  Director._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Director.allowFields();
    allowedFields.push(Director._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Director.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  Director.associate = function (models) {
    Director.hasMany(models.movie, {
      foreignKey: "director_id",
      constraints: false,
    });
  };

  Director.allowFields = function () {
    return ["id", "name"];
  };

  Director.labels = function () {
    return ["ID", "Name"];
  };

  Director.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  Director.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  return Director;
};
