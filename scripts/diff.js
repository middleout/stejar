require("colors");
const fs = require("fs");
const jsdiff = require("diff");
const dirs = require("./getDirectories")("./packages");
const path = require("path");
const prompt = require('prompt');

const one = JSON.parse(fs.readFileSync("./default-configs/package.json", "utf-8"));

function diffFiles(file, type) {
    let other = JSON.parse(fs.readFileSync(file, "utf-8"));

    let diff;
    if (type == "json" ) {
        diff = jsdiff.diffJson(one, other);
    } else {
        diff = jsdiff.diffChars(one, other);
    }


    let hasChanges = false;
    let data = [];
    diff.forEach(function(part) {
        // green for additions, red for deletions
        // grey for common parts
        const color = part.added ? "green" : part.removed ? "red" : "grey";

        data.push(part.value[color]);
        if (color !== "grey") {
            hasChanges = true;
        }
    });

    if (!hasChanges) {
        return null;
    }

    return data;
}

function start(dir) {
    let data = diffFiles(path.join("./", "packages", dir, "package.json"), "json")
    console.log("Package.json diff for " + dir);
    console.log('---');
    data.forEach(item => process.stderr.write(item));
    console.log('');
    console.log('');
    prompt.start();
    prompt.get(['Press enter to continue...'], () => {
        if (dirs.length === 0) {
            return;
        }

        dir = dirs.shift();
        start(dir);
    });
}

start(dirs.shift());
