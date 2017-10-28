process.env.BABEL_ENV = "cjs";
module.exports = babelJest => babelJest.createTransformer(require("./babel.preset.js"));
