const { readdirSync } = require("fs-extra");
const isDirectory = require("./isDirectory");

module.exports = source => readdirSync(source).filter(name => isDirectory(source, name));
