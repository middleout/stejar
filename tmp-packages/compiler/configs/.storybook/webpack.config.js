require("@std/esm");

//The browser/server configuration
module.exports = function(storybookBaseConfig, configType) {
    let config = require(`./../scripts/webpack/config/webpack.config.storybook.js`).default;

    config.module.rules.forEach(rule => storybookBaseConfig.module.rules.push(rule));
    config.plugins.forEach(plugin => storybookBaseConfig.plugins.push(plugin));

    return storybookBaseConfig;
};
