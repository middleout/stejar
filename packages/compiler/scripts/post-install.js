const fs = require("fs");
const path = require("path");

console.log('Setting up symlinks...')

fs.symlinkSync(path.join(__dirname, "..", "configs", ".babelrc"), path.resolve("./.babelrc"));
fs.symlinkSync(path.join(__dirname, "..", "configs", ".editorconfig"), path.resolve("./.editorconfig"));
fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.json"), path.resolve("./tsconfig.json"));
fs.symlinkSync(path.join(__dirname, "..", "configs", "tslint.json"), path.resolve("./tslint.json"));
fs.symlinkSync(path.join(__dirname, "..", "configs", "webpack.js"), path.resolve("./webpack.js"));

if (fs.existsSync("./__tests__")) {
    fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.tests.json"), path.resolve("./__tests__/tsconfig.json"));
    fs.symlinkSync(path.join(__dirname, "..", "configs", "jest-beforeTest.js"), path.resolve("./__tests__/beforeTest.js"));
}

console.log('Done !');
