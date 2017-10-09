const BABEL_ENV = process.env.BABEL_ENV;
module.exports = require("./babel-config")(!(BABEL_ENV != undefined && BABEL_ENV !== "cjs"));
