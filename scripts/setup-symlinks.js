const fs = require("fs");
const path = require("path");
const getDirs = require("./getDirectories");
const symlinks = require("./symlinks");

function callback(err) {
    if (err) {
        if (err.code === "EEXIST") {
            fs.unlinkSync(err.dest);
            fs.symlink(err.path, err.dest, "file", callback);
        } else {
            console.log(err);
        }
    }
}

module.exports = function setupSymlinks(moduleName) {
    const dirs = getDirs("./packages");

    dirs.forEach(dir => {
        if (moduleName && dir !== moduleName) {
            return true;
        }

        Object.keys(symlinks).forEach(from => {
            fs.symlink(
                path.join(__dirname, "..", "configs", from),
                path.join(__dirname, "..", "packages", dir, symlinks[from]),
                "file",
                callback
            );
        });

        console.log("Built configs for package: " + dir);
    });
};
