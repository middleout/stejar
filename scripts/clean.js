const path = require("path");
const fs = require("fs");
const dirs = require("./getDirectories")("./packages");
const symlinks = require("./symlinks");

dirs.forEach(dir => {
    dirs.forEach(dir => {
        Object.keys(symlinks).forEach(key => {
            const jsPath = path.join("./", "packages", dir, symlinks[key]);
            if (fs.existsSync(jsPath)) {
                fs.unlinkSync(jsPath);
            }
        });
    });
});
