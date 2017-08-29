const fs = require("fs");
const path = require("path");
var link = require('fs-symlink')

console.log("Setting up symlinks...");

link(path.join(__dirname, "..", "configs", ".prettierrc"), "./../../../.prettierrc");
link(path.join(__dirname, "..", "configs", ".babelrc"), "./../../../.babelrc");
link(path.join(__dirname, "..", "configs", ".editorconfig"), "./../../../.editorconfig");
link(path.join(__dirname, "..", "configs", ".eslintrc"), "./../../../.eslintrc");
link(path.join(__dirname, "..", "configs", ".stylelintrc"), "./../../../.stylelintrc");
link(path.join(__dirname, "..", "configs", ".lintstagedrc"), "./../../../.lintstagedrc");
link(path.join(__dirname, "..", "configs", "jest.config.json"), "./../../../jest.config.json");
link(path.join(__dirname, "..", "configs", ".storybook"), "./../../../.storybook");
link(path.join(__dirname, "..", "configs", ".gitignore"), "./../../../.gitignore");

console.log("Done !");
