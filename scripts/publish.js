const { readFileSync, lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const semver = require("semver");
const { execSync } = require("child_process");

const exec = (command, extraEnv, cwd = "./") =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env, extraEnv),
        cwd,
    });

const isDirectory = (source, name) => lstatSync(join(source, name)).isDirectory();
const getDirectories = source => readdirSync(source).filter(name => isDirectory(source, name));

const dirs = getDirectories("./src");

dirs.forEach(dir => {
    console.log(`Publishing ${dir} \n--`);
    const { version } = JSON.parse(readFileSync(`./src/${dir}/package.json`));

    exec(
        `yarn publish --registry http://localhost:4873 --new-version ${semver.inc(version, "patch")}`,
        {},
        `./src/${dir}`
    );
    console.log(`\n`);
});
