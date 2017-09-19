const exec = require("child_process").exec;
const fs = require("fs");
const chalk = require("chalk");

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
    "npm-check-updates", // used by this script,
];

const packages = fs.readdirSync("./../");

exec("git diff-index --quiet HEAD -- || echo \"untracked\";", (err, std) => {
    if (std.indexOf("untracked") !== -1) {
        console.log(chalk.bgRed.bold('You must commit your files to GIT before upgrading your dependencies versions.'));
        process.exit(1);
        return;
    }

    exec("depcheck --ignores " + ignore.concat(packages).join(","), (err,std) => {
        if (std.indexOf("No depcheck issue") === -1) {
            console.log(std);
            console.log(chalk.bgRed.bold('Issues with dependencies'));
            process.exit(1);
            return;
        }
    });
});
