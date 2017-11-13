/**
 * We need the script here due to the dependency "babel-jest".
 * It has to be resolved from here, and passed along to the parent config
 * as an object. Otherwise you have to install it in the root folder.
 */
module.exports = require("./../../../scripts/jest.babelTransform.js")(require("babel-jest"));
