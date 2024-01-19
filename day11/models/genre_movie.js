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
  const Genre_Movie = sequelize.define(
    "genre_movie",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      movie_id: DataTypes.INTEGER,
      genre_id: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "genre_movie",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Genre_Movie);

  Genre_Movie._preCreateProcessing = function (data) {
    return data;
  };
  Genre_Movie._postCreateProcessing = function (data) {
    return data;
  };
  Genre_Movie._customCountingConditions = function (data) {
    return data;
  };

  Genre_Movie._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Genre_Movie.allowFields();
    allowedFields.push(Genre_Movie._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Genre_Movie.timeDefaultMapping = function () {
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

  // Genre_Movie.associate = function (models) {
  //   Genre_Movie.belongsTo(models.movie, {
  //     foreignKey: "movie_id",
  //     as: "movie",
  //     constraints: false,
  //   });
  //   Genre_Movie.belongsTo(models.genre, {
  //     foreignKey: "genre_id",
  //     as: "actor",
  //     constraints: false,
  //   });
  // };

  Genre_Movie.allowFields = function () {
    return ["id", "name"];
  };

  Genre_Movie.labels = function () {
    return ["ID", "Name"];
  };

  Genre_Movie.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  Genre_Movie.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  return Genre_Movie;
};
