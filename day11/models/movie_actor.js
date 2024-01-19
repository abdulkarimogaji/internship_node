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
  const Movie_Actor = sequelize.define(
    "movie_actor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      movie_id: DataTypes.INTEGER,
      actor_id: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "movie_actor",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Movie_Actor);

  Movie_Actor._preCreateProcessing = function (data) {
    return data;
  };
  Movie_Actor._postCreateProcessing = function (data) {
    return data;
  };
  Movie_Actor._customCountingConditions = function (data) {
    return data;
  };

  Movie_Actor._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Movie_Actor.allowFields();
    allowedFields.push(Movie_Actor._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Movie_Actor.timeDefaultMapping = function () {
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

  Movie_Actor.allowFields = function () {
    return ["id", "name"];
  };

  Movie_Actor.labels = function () {
    return ["ID", "Name"];
  };

  Movie_Actor.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  Movie_Actor.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
    ];
  };

  return Movie_Actor;
};
