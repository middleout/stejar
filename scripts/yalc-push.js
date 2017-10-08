const execSync = require("child_process").execSync;
const packages = require("./functions/getDirectories")("./packages");

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env, extraEnv),
    });

packages.forEach(packageName => {
    console.log("Pushing via Yalc ...");

    exec("yalc push packages/" + packageName);
});
