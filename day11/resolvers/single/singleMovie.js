"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * refer_log Resolve Single
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { ApolloError } = require("apollo-server-express");
const graphqlFields = require("graphql-fields");

module.exports = async (_, { id }, { db }, info) => {
  try {
    const fields = graphqlFields(info).data;
    const attributes = db.movie.intersection(fields);
    const include = [];

    if (fields.hasOwnProperty("actors")) {
      include.push({ model: db.actor, as: "actors" });
    }
    if (fields.hasOwnProperty("reviews")) {
      include.push({ model: db.review, as: "reviews" });
    }
    if (fields.hasOwnProperty("genres")) {
      include.push({ model: db.genre, as: "genres" });
    }

    const movie = await db.movie.findOne({
      where: { id: id },
      attributes,
      include,
    });
    return {
      success: true,
      data: movie,
      message: "Movie fetched successfully",
      errors: [],
      code: 200,
    };
  } catch (error) {
    console.log("single_movie -> error", error);
    return new ApolloError("InternalServerError");
  }
};
