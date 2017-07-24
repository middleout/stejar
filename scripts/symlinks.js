const path = require("path");

module.exports = {
    ".babelrc": ".babelrc",
    "tsconfig.json": "tsconfig.json",
    "tsconfig.tests.json": path.join("__tests__", "tsconfig.json"),
    "tslint.json": "tslint.json",
    "webpack.config.js": "webpack.config.js",
};
