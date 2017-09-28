const execSync = require("child_process").execSync;
const path = require("path");

const exec = (command) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env),
    });

module.exports = () => {

    console.log(process.cwd);
    console.log(path.resolve("./"));

    console.log('Prepublishing ...');
    exec("npm run test:run");
    exec("npm run build");
    // TODO:
    // check the "files" property inside the package.json to make sure it has all the files from the "build" - basically all the .js files
}

