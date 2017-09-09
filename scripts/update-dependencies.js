require("colors");
const path = require("path");
const fs = require("fs");
const dirs = require("./getDirectories")("./packages");
const ncu = require("npm-check-updates");
const jsdiff = require("diff");
const exec = require("child_process").exec;
const chalk = require("chalk");

function upgradeFile(pathToFile) {
    console.log("Upgrading dependencies for " + pathToFile);

    return ncu
        .run({
            packageFile: pathToFile,
            upgradeAll: true,
            jsonAll: true,
        })
        .then(newFile => {
            console.log("");
            console.log("==" + pathToFile + "==");
            var one = newFile;
            var other = JSON.parse(fs.readFileSync(pathToFile, "utf-8"));

            // var diff = jsdiff.diffChars(one, other);
            var diff = jsdiff.diffJson(one, other);

            diff.forEach(function(part) {
                // green for additions, red for deletions
                // grey for common parts
                var color = part.added ? "green" : part.removed ? "red" : "grey";
                if (color === "grey") {
                    return;
                }

                process.stderr.write(part.value[color]);
            });

            fs.writeFileSync(pathToFile, JSON.stringify(newFile, undefined, 4));
            console.log("Upgraded dependencies for " + pathToFile);
            console.log("");
        });
}

console.log("");
console.log("Updating dependencies ...");

exec('git diff-index --quiet HEAD -- || echo "untracked"; ', (err, std) => {
    if (std.indexOf("untracked") !== -1) {
        console.log("");

        console.log(
            chalk.bgRed(
                chalk.white(chalk.bold("You must commit your GIT changes first before updating packages dependencies"))
            )
        );
        process.exit(1);
    }
});

var promises = [];

dirs.forEach(dir => {
    promises.push(upgradeFile(path.join("./", "packages", dir, "package.json")));
});

Promise.all(promises).then(() => console.log("Updated all dependencies ..."));
