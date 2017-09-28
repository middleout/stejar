const exec = require("child_process").exec;
const chalk = require("chalk");
const endOfLine = require("os").EOL;

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
});
