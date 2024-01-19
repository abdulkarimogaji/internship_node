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
  const Genre = sequelize.define(
    "genre",
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
      tableName: "genre",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Genre);

  Genre._preCreateProcessing = function (data) {
    return data;
  };
  Genre._postCreateProcessing = function (data) {
    return data;
  };
  Genre._customCountingConditions = function (data) {
    return data;
  };

  Genre._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Genre.allowFields();
    allowedFields.push(Genre._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Genre.timeDefaultMapping = function () {
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

  Genre.associate = function (models) {
    Genre.belongsToMany(models.movie, {
      through: models.genre_movie,
      as: "movies",
      sourceKey: "id",
      targetKey: "id",
      foreignKey: "genre_id",
    });
    Genre.hasMany(models.movie, {
      foreignKey: "main_genre",
      constraints: false,
    });
  };

  Genre.allowFields = function () {
    return ["id", "name"];
  };

  Genre.labels = function () {
    return ["ID", "Name"];
  };

  Genre.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  Genre.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  return Genre;
};
