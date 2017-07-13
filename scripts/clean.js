const path = require("path");
const fs = require("fs");
const dirs = require("./common/getDirectories")("./packages");
const symlinks = require("./common/symlinks");

dirs.forEach(dir => {
    const jsonPath = path.join("./", "packages", dir, "package.json");
    if (fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
    }

    dirs.forEach(dir => {
        Object.keys(symlinks).forEach(key => {
            const jsPath = path.join("./", "packages", dir, symlinks[key]);
            if (fs.existsSync(jsPath)) {
                fs.unlinkSync(jsPath);
            }
        });
    });
});
