const path = require("path");
const fs = require("fs");
const dirs = require("./getDirectories")("./packages");
const ncu = require("npm-check-updates");

function upgradeFile(pathToFile) {
    return ncu
        .run({
            packageFile: pathToFile,
            upgradeAll: true,
            jsonAll: true,
        })
        .then(newFile => {
            fs.writeFileSync(pathToFile, JSON.stringify(newFile, undefined, 4));
            console.log("Upgrades dependencies for " + pathToFile);
        });
}

module.exports = function() {
    upgradeFile("configs/_package.json");

    var promises = [];

    dirs.forEach(dir => {
        const jsonPath = path.join("./", "packages", dir, "local.package.json");

        if (fs.existsSync(jsonPath)) {
            promises.push(upgradeFile(jsonPath));
        }
    });

    return Promise.all(promises);
};
