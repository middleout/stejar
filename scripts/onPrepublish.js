const execSync = require("child_process").execSync;

const exec = (command) =>
    execSync(command, {
        stdio: "inherit",
        env: Object.assign({}, process.env),
    });

module.exports = (path) => {

    console.log('Prepublishing ' + path + ' ...');
    console.log(exec("cd " + path + " && npm run test:run"));
    console.log(exec("cd " + path + " && npm run build"));
    // TODO:
    // check the "files" property inside the package.json to make sure it has all the files from the "build" - basically all the .js files
}

