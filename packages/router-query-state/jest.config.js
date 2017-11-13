/**
 * We want to have the "root dir" of babel here (in the package dir)
 * but want to use the actual config from the common scripts
 *
 * CLI  -> package/jest.config.js
 *      -> common/jest.config.js
 *      -> package/jest.babelTransform.js
 *      -> common/jest.babelTransform.js
 *          -> common/babel.preset.js
 *          -> common/babel.preset.js
 *      -> package/jest.beforeTest.js
 *      -> common/jest.beforeTest.js
 */
module.exports = require("./../../scripts/jest.config.js");
