const path = require("path");
const fs = require("fs");
const dirs = require("./getDirectories")("./packages");
const ncu = require("npm-check-updates");

function upgradeFile(pathToFile) {
    ncu
        .run({
            packageFile: pathToFile,
            upgradeAll: true,
            jsonAll: true,
        })
        .then(newFile => {
            fs.writeFileSync(pathToFile, JSON.stringify(newFile));
            console.log("Upgrades dependencies for " + pathToFile);
        });
}

upgradeFile("configs/_package.json");

dirs.forEach(dir => {
    const jsonPath = path.join("./", "packages", dir, "local.package.json");

    if (fs.existsSync(jsonPath)) {
        upgradeFile(jsonPath);
    }
});
