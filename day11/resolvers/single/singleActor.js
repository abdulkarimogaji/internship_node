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
    const attributes = db.actor.intersection(graphqlFields(info).data);

    const actor = await db.actor.findOne({
      where: { id: id },
      attributes,
    });
    return {
      success: true,
      data: actor,
      message: "Actor fetched successfully",
      errors: [],
      code: 200,
    };
  } catch (error) {
    console.log("single_actor -> error", error);
    return new ApolloError("InternalServerError");
  }
};
