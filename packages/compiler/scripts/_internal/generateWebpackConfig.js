const webpackConfigs = require("./../../configs/webpack");

module.exports = function generateWebpackConfig(isProduction) {
    return isProduction ? webpackConfigs.prod : webpackConfigs.dev;
};
