const execSync = require("child_process").execSync;

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env, extraEnv),
    });

console.log("Building CommonJS src ...");

exec("babel src -d . --ignore __tests__", {
    BABEL_ENV: "cjs",
});

console.log("\nBuilding ES src ...");

exec("babel src -d es --ignore __tests__", {
    BABEL_ENV: "es",
});
