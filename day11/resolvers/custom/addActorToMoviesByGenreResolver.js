"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { ApolloError, UserInputError } = require("apollo-server-express");
const { Validator } = require("node-input-validator");

module.exports = async (parent, args, { db }, info) => {
  try {
    const { genre_id, actor_id } = args;
    const v = new Validator(
      {
        genre_id,
        actor_id,
      },
      { genre_id: "required", actor_id: "required" }
    );

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });

    // get all movies with a main genre of genre_id
    const movies = await db.movie.findAll({
      where: { main_genre: genre_id },
      attributes: ["id"],
    });

    await Promise.all(
      movies.map((m) =>
        db.movie_actor.create({
          movie_id: m.id,
          actor_id: actor_id,
        })
      )
    );
    return {
      success: true,
      message: "actors added successfully",
      errors: [],
      code: 201,
    };
  } catch (error) {
    console.log("create_user -> error", error);
    return new ApolloError("InternalServerError");
  }
};
