const fs = require("fs");
const path = require("path");
const dirs = require("./common/getDirectories")("./packages");
const symlinks = require("./common/symlinks");

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

function setupSymlinks(symlinks) {
    dirs.forEach(dir => {
        Object.keys(symlinks).forEach(from => {
            fs.symlink(
                path.join(__dirname, "..", "configs", from),
                path.join(__dirname, "..", "packages", dir, symlinks[from]),
                "file",
                callback
            );
        });

        console.log('Built configs for package: ' + dir);
    });
}

setupSymlinks(symlinks);
