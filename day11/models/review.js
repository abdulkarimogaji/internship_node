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
  const Review = sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notes: DataTypes.STRING,
      movie_id: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "review",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Review);

  Review._preCreateProcessing = function (data) {
    return data;
  };
  Review._postCreateProcessing = function (data) {
    return data;
  };
  Review._customCountingConditions = function (data) {
    return data;
  };

  Review._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Review.allowFields();
    allowedFields.push(Review._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Review.timeDefaultMapping = function () {
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

  Review.associate = function (models) {
    Review.belongsTo(models.movie, {
      foreignKey: "movie_id",
      as: "movie",
      constraints: false,
    });
  };

  Review.allowFields = function () {
    return ["id", "notes", "movie_id"];
  };

  Review.labels = function () {
    return ["ID", "Notes", "Movie"];
  };

  Review.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["notes", "Notes", "required"],
      ["movie_id", "Movie", "required"],
    ];
  };

  Review.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["notes", "Notes", "required"],
      ["movie_id", "Movie", "required"],
    ];
  };

  return Review;
};
