const { lstatSync, readdirSync, statSync, copySync } = require("fs-extra");
const nanomatch = require("nanomatch");
const { join } = require("path");
const { execSync } = require("child_process");
const args = process.argv;
const target = (args[2] || "").replace("@stejar/", "");

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env, extraEnv),
    });

const isDirectory = (source, name) => lstatSync(join(source, name)).isDirectory();
const getDirectories = source => readdirSync(source).filter(name => isDirectory(source, name));
var getFiles = function(dir) {
    var results = [];
    var list = readdirSync(dir);
    list.forEach(function(file) {
        file = dir + "/" + file;
        var stat = statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(getFiles(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
};

const dirs = getDirectories("./src")
    .filter(item => !target || item == target)
    .filter(item => item !== "create-stejar-app")
    .filter(item => item[0] !== "_");

dirs.forEach(dir => {
    console.log(`Building ${dir} \n--`);
    exec(`babel src/${dir}/src -d src/${dir}/es --ignore tests`);

    nanomatch(getFiles(`src/${dir}/src`), "**/*.d.ts").forEach(path => {
        copySync(path, path.replace(`src/${dir}/src`, `src/${dir}/es`));
    });

    console.info(`Built ${dir} !\n--`);
    console.log(`\n`);
});
