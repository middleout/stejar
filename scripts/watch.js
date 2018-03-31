const watch = require("watch");
const nanomatch = require("nanomatch");
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");
const args = process.argv;
const target = (args[2] || "").replace("@stejar/", "");

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
        env: Object.assign({}, process.env, extraEnv),
    });

const isDirectory = (source, name) => lstatSync(join(source, name)).isDirectory();
const getDirectories = source => readdirSync(source).filter(name => isDirectory(source, name));

const dirs = getDirectories("./src")
    .filter(item => !target || item == target)
    .filter(item => item !== "create-stejar-app");

function rebuild(module) {
    if (-1 !== dirs.indexOf(module)) {
        console.log(`Rebuilding ${module}`);
        exec(`node scripts/build.js ${module}`);
        console.log(`Done !`);
    }
}

function getModuleName(path) {
    return path.split("/")[1];
}

function match(pattern, filePath, funcs) {
    if (nanomatch([filePath], pattern).length > 0) {
        console.warn(`File changed ${filePath} ...`);

        let result = filePath;
        funcs.forEach(func => {
            result = func(result);
        });

        return result;
    }
}

watch.watchTree("./src", function(f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
        console.warn("Watching ...");
        return;
    }

    match(["src/**/src/**/*.js", "src/**/src/**/*.jsx"], f, [getModuleName, rebuild]);
});
