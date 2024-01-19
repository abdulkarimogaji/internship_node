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
  const Actor = sequelize.define(
    "actor",
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
      tableName: "actor",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Actor);

  Actor._preCreateProcessing = function (data) {
    return data;
  };
  Actor._postCreateProcessing = function (data) {
    return data;
  };
  Actor._customCountingConditions = function (data) {
    return data;
  };

  Actor._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Actor.allowFields();
    allowedFields.push(Actor._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Actor.timeDefaultMapping = function () {
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

  Actor.associate = function (models) {
    Actor.belongsToMany(models.movie, {
      through: models.movie_actor,
      as: "movies",
      sourceKey: "id",
      targetKey: "id",
      foreignKey: "actor_id",
    });
  };

  Actor.allowFields = function () {
    return ["id", "name"];
  };

  Actor.labels = function () {
    return ["ID", "Name"];
  };

  Actor.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  Actor.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  return Actor;
};
