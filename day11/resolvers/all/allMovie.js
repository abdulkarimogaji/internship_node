"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * user Resolve All
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { ApolloError } = require("apollo-server-express");
const Sequelize = require("sequelize");
const { last } = require("lodash");
const graphqlFields = require("graphql-fields");

module.exports = async (_, { first, after }, { db, credential }, info) => {
  //Check Auth if user allowed
  try {
    const fields = graphqlFields(info).data;
    const attributes = db.movie.intersection(fields);

    const options = {
      where: {},
      limit: first,
      attributes,
      include: [],
    };

    if (after) {
      options.where = {
        id: {
          [Sequelize.Op.gt]: after,
        },
      };
    }

    if (fields.hasOwnProperty("actors")) {
      options.include.push({ model: db.actor, as: "actors" });
    }
    if (fields.hasOwnProperty("reviews")) {
      options.include.push({ model: db.review, as: "reviews" });
    }
    if (fields.hasOwnProperty("genres")) {
      options.include.push({ model: db.genre, as: "genres" });
    }

    const { count, rows } = await db.movie.findAndCountAll(options);

    return {
      success: true,
      data: rows,
      message: "Movies fetched successfully",
      errors: [],
      code: 200,
    };
  } catch (error) {
    console.log("movie -> error", error);
    return new ApolloError("InternalServerError");
  }
};
