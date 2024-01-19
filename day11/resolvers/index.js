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
const singleUserResolver = require("./single/singleUser");
const typeUserResolver = require("./type/typeUser");

const createLinkResolver = require("./create/createLink");
const typeLinkResolver = require("./type/typeLink");
const singleLinkResolver = require("./single/singleLink");
const deactivateAllLinksResolver = require("./delete/deactivateAllLinks");

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
    // ...calendarResolver.Query,
    // ...customImageResolver.Query,
    // ...noteResolver.Query,
    // ...connectionStepsResolver.Query
  },
  Mutation: {
    updateUser: updateUserResolver,
    createLink: createLinkResolver,
    deactivateAllLinks: deactivateAllLinksResolver,
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
