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
    const attributes = db.director.intersection(graphqlFields(info).data);

    const options = {
      where: {},
      limit: first,
      attributes,
    };

    if (after) {
      options.where = {
        id: {
          [Sequelize.Op.gt]: after,
        },
      };
    }

    const { count, rows } = await db.director.findAndCountAll(options);

    return {
      success: true,
      data: rows,
      message: "Directors fetched successfully",
      errors: [],
      code: 200,
    };
  } catch (error) {
    console.log("director -> error", error);
    return new ApolloError("InternalServerError");
  }
};
