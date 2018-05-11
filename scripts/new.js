const { readFileSync, existsSync, mkdirSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");
const args = process.argv;
const appName = JSON.parse(readFileSync("./package.json"))._name;
const version = JSON.parse(readFileSync("./lerna.json")).version;
const target = (args[2] || "").replace(appName, "");

if (!target) {
    throw new Error("YOu must provide the package name");
}

if (existsSync(`./src/${target}`)) {
    throw new Error(`Package "${target}" already exists`);
}

mkdirSync(`./src/${target}`);
mkdirSync(`./src/${target}/src`);
mkdirSync(`./src/${target}/tests`);

writeFileSync(
    `./src/${target}/package.json`,
    JSON.stringify(
        {
            name: `${appName}/${target}`,
            version: version,
            main: "es/index.js",
            license: "MIT",
            sideEffects: false,
            files: ["es"],
            dependencies: {},
        },
        null,
        4
    )
);

writeFileSync(`./src/${target}/src/index.js`, "// TODO");

writeFileSync(`./src/${target}/tests/.gitkeep`, "");

execSync("yarn link", {
    stdio: "inherit",
    cwd: `./src/${target}`,
});
