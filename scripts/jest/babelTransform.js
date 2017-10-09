const babelConfig = require("./../babel-config")(true);
module.exports = require("babel-jest").createTransformer(babelConfig);
