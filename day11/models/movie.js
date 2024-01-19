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
  const Movie = sequelize.define(
    "movie",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      director_id: DataTypes.INTEGER,
      main_genre: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      main_genre: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "movie",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Movie);

  Movie._preCreateProcessing = function (data) {
    data.status = 1;
    return data;
  };
  Movie._postCreateProcessing = function (data) {
    return data;
  };
  Movie._customCountingConditions = function (data) {
    return data;
  };

  Movie._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Movie.allowFields();
    allowedFields.push(Movie._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Movie.timeDefaultMapping = function () {
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

  Movie.associate = function (models) {
    Movie.belongsTo(models.director, {
      foreignKey: "director_id",
      as: "director",
      constraints: false,
    });

    Movie.belongsToMany(models.genre, {
      through: models.genre_movie,
      as: "genres",
      sourceKey: "id",
      targetKey: "id",
      foreignKey: "movie_id",
    });

    Movie.belongsToMany(models.actor, {
      through: models.movie_actor,
      as: "actors",
      sourceKey: "id",
      targetKey: "id",
      foreignKey: "movie_id",
    });

    Movie.belongsTo(models.genre, {
      foreignKey: "main_genre",
      constraints: false,
    });
  };

  Movie.status_mapping = function (status) {
    const mapping = { 0: "Inactive", 1: "Active" };

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };

  Movie.allowFields = function () {
    return ["id", "title", "director_id", "main_genre", "status", "review"];
  };

  Movie.labels = function () {
    return ["ID", "Title", "Director", "Main genre", "Status", "Review"];
  };

  Movie.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["title", "Title", "required"],
      ["director_id", "Director", "required"],
      ["main_genre", "Main genre", "required"],
      ["status", "Status", ""],
      ["review", "Review", ""],
    ];
  };

  Movie.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["title", "Title", "required"],
      ["director_id", "Director", "required"],
      ["main_genre", "Main genre", "required"],
      ["status", "Status", "required|in_list[0,1]"],
      ["review", "Review", ""],
    ];
  };

  return Movie;
};
