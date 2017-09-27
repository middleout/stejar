const exec = require("child_process").exec;
const fs = require("fs");
const chalk = require("chalk");
const endOfLine = require("os").EOL;
const depcheck = require("depcheck");

const ignore = [
    "depcheck", // Used in this script,
    "babel-cli", // used to compile in scripts/build.js
    "husky", // Used in combination with lint-staged
    "prettier", // Used by lint-staged,
    "eslint-config-plugin:react", // Already there, but with "-" instead of ":"
];

const packages = fs.readdirSync("./../").map(item => "@stejar/" + item);

exec("git status -s", (err, std) => {
    const modified = std
        .split(endOfLine)
        .filter(item => !!item)
        .filter(item => item.indexOf("../") === -1);

    if (modified.length > 0) {
        console.log(chalk.bgRed.bold("You must commit your files to GIT before upgrading your dependencies versions."));
        process.exit(1);
        return;
    }

    const options = {
        ignoreMatches: ignore.concat(packages),
    };

    depcheck(process.cwd(), options, result => {
        let error = false;
        if (Object.keys(result.missing).length > 0) {
            error = true;
            console.log('');
            console.log(chalk.bgRed.bold("Missing dependencies:"));
            Object.keys(result.missing).map(item => console.log(item + " used in " + result.missing[item]));
        }

        if (Object.keys(result.dependencies).length > 0) {
            error = true;
            console.log("");
            console.log(chalk.bgRed.bold("Unused dependencies:"));
            result.dependencies.map(item => console.log(item));
        }

        if (Object.keys(result.devDependencies).length > 0) {
            console.log('');
            console.log(chalk.bgYellow.bold("Unused DEV dependencies (but not considered an issue):"));
            result.devDependencies.map(item => console.log(item));
        }

        if (error) {
            console.log('');
            console.log(chalk.bgRed.bold("Issues with dependencies !"));
            process.exit(1);
            return
        }
    });
});
