const { lstatSync } = require("fs-extra");
const { join } = require("path");

module.exports = (source, name) => lstatSync(join(source, name)).isDirectory();
