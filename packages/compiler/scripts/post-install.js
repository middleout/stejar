const fs = require("fs");
const path = require("path");
var link = require('fs-symlink')

console.log("Setting up symlinks...");

link(path.join(__dirname, "..", "configs", ".babelrc"), "./../../../.babelrc");
link(path.join(__dirname, "..", "configs", ".editorconfig"), "./../../../.editorconfig");
link(path.join(__dirname, "..", "configs", "tsconfig.json"), "./../../../tsconfig.json");
link(path.join(__dirname, "..", "configs", "tslint.json"), "./../../../tslint.json");
link(path.join(__dirname, "..", "configs", "jest.config.json"), "./../../../jest.config.json");

if (fs.existsSync("./../../../__tests__")) {
    link(path.join(__dirname, "..", "configs", "tsconfig.tests.json"), "./../../../__tests__/tsconfig.json");
    link(path.join(__dirname, "..", "configs", "jest-beforeTest.js"), "./../../../__tests__/jest-beforeTest.js");
}

console.log("Done !");
