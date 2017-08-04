const fs = require("fs");
const path = require("path");

console.log('Setting up symlinks...')

console.log(path.resolve('./'));
console.log(path.join(__dirname, './'));

fs.symlinkSync(path.join(__dirname, "..", "configs", ".babelrc"), "./.babelrc");
fs.symlinkSync(path.join(__dirname, "..", "configs", ".editorconfig"), "./.editorconfig");
fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.json"), "./tsconfig.son"));
fs.symlinkSync(path.join(__dirname, "..", "configs", "tslint.json"), "./tslint.son"));
fs.symlinkSync(path.join(__dirname, "..", "configs", "webpack.js"), "./webpack.s"));

if (fs.existsSync("./__tests__")) {
    fs.symlinkSync(path.join(__dirname, "..", "configs", "tsconfig.tests.json"), "./__tests__/tsconfig.json");
    fs.symlinkSync(path.join(__dirname, "..", "configs", "jest-beforeTest.js"), "./__tests__/beforeTest.js");
}

console.log('Done !');
