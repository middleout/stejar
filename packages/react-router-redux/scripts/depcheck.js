const exec = require("child_process").exec;
const fs = require("fs");

const ignore = [
    "depcheck", // Used in this script,
    "babel-cli", // used to compile in scripts/build.js
    "babel-plugin-dev-expression", // Used in scripts/babel-preset.js
    "babel-plugin-transform-react-remove-prop-types", // Used in scripts/babel-preset.js
    "babel-preset-es2015", // Used in scripts/babel-preset.js
    "babel-preset-react", // Used in scripts/babel-preset.js
    "babel-preset-stage-1", // Used in scripts/babel-preset.js
    "husky", // Used in combination with lint-staged
    "prettier", // Used by lint-staged,
    "eslint-config-plugin:react", // Already there, but with "-" instead of ":",
    "npm-check", // used by this script,
    "redux",
];

const packages = fs.readdirSync("./../");

exec("depcheck --ignores " + ignore.concat(packages).join(","), (err, std) => {
    if (std.indexOf("No depcheck issue") === -1) {
        console.log(std);
        throw new Error("Errors!");
    }

    console.log(std + "\r\n");
});
