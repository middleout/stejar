const fs = require("fs");
const path = require("path");

console.log("Setting up symlinks...");

fs.symlinkSync(path.join(__dirname, "..", "configs", ".babelrc"), "./../../../.babelrc");
fs.symlinkSync(path.join(__dirname, "..", "configs", ".editorconfig"), "./../../../.editorconfig");
fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.json"), "./../../../tsconfig.json");
fs.symlinkSync(path.join(__dirname, "..", "configs", "tslint.json"), "./../../../tslint.json");
fs.symlinkSync(path.join(__dirname, "..", "configs", "jest.config.js"), "./../../../jest.config.js");

if (fs.existsSync("./../../../__tests__")) {
    fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.tests.json"), "./../../../__tests__/tsconfig.json");
    fs.symlinkSync(path.join(__dirname, "..", "configs", "jest-beforeTest.js"), "./../../../__tests__/jest-beforeTest.js");
}

console.log("Done !");
