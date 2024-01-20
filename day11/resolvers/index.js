/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: {{{year}}}*/
/**
 * Resolve Index
 * @copyright {{{year}}} Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { GraphQLUpload } = require("graphql-upload");

const updateUserResolver = require("./update/updateUser");
const createUserResolver = require("./create/createUser");
const singleUserResolver = require("./single/singleUser");
const typeUserResolver = require("./type/typeUser");

const createLinkResolver = require("./create/createLink");
const typeLinkResolver = require("./type/typeLink");
const singleLinkResolver = require("./single/singleLink");
const singleMovieResolver = require("./single/singleMovie");
const singleDirectorResolver = require("./single/singleDirector");
const singleActorResolver = require("./single/singleActor");
const singleGenreResolver = require("./single/singleGenre");
const deactivateAllLinksResolver = require("./delete/deactivateAllLinks");
const getMoviesResolver = require("./all/allMovie");
const getDirectorsResolver = require("./all/allDirector");
const getActorsResolver = require("./all/allActor");
const getGenresResolver = require("./all/allGenre");
const getUsersResolver = require("./all/allUser");
const addActorToMoviesByGenreResolver = require("./custom/addActorToMoviesByGenreResolver");

// const calendarResolver = require('./custom/calendar');
// const noteResolver = require('./custom/note');
// const customImageResolver = require('./custom/image');
// const uploadFileMutationResolver = require('./custom/uploadFile');

// const connectionStepsResolver = require('./custom/connectionSteps');

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    user: singleUserResolver,
    link: singleLinkResolver,

    movie: singleMovieResolver,
    director: singleDirectorResolver,
    actor: singleActorResolver,
    genre: singleGenreResolver,

    getMovies: getMoviesResolver,
    getDirectors: getDirectorsResolver,
    getActors: getActorsResolver,
    getGenres: getGenresResolver,

    getUsers: getUsersResolver,
    // ...calendarResolver.Query,
    // ...customImageResolver.Query,
    // ...noteResolver.Query,
    // ...connectionStepsResolver.Query
  },
  Mutation: {
    updateUser: updateUserResolver,
    createLink: createLinkResolver,
    deactivateAllLinks: deactivateAllLinksResolver,
    addActorToMoviesByGenre: addActorToMoviesByGenreResolver,
    // uploadFile: uploadFileMutationResolver,
    // ...calendarResolver.Mutation,
    // ...customImageResolver.Mutation,
    // ...noteResolver.Mutation,
  },

  // ...calendarResolver.Type,
  // ...noteResolver.Type,

  User: typeUserResolver,
  Link: typeLinkResolver,
};
