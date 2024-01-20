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
    const attributes = db.genre.intersection(fields);
    const include = [];

    if (fields.hasOwnProperty("movies")) {
      include.push({ model: db.movie, as: "movies" });
    }

    const genre = await db.genre.findOne({
      where: { id: id },
      attributes,
      include,
    });
    return {
      success: true,
      data: genre,
      message: "Genre fetched successfully",
      errors: [],
      code: 200,
    };
  } catch (error) {
    console.log("single_genre -> error", error);
    return new ApolloError("InternalServerError");
  }
};
