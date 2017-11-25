const directories = require("./functions/getDirectories")("./packages");
const execSync = require("child_process").execSync;

const exec = (command, wd) => {
    try {
        return execSync(command, {
            cwd: wd,
            stdio: "pipe",
            env: Object.assign({}, process.env),
            encoding: "utf8",
        });
    } catch (err) {
        return err.stdout;
    }
};

const finalResult = {};

directories.forEach(directory => {
    console.log(`Checking ${directory} ...`);

    finalResult[directory] = [];
    const result = JSON.parse(exec("npm outdated --json --long", `./packages/${directory}`));

    Object.keys(result).forEach(item => {
        const name = item.replace("@stejar/", "");

        if (directory.includes(name)) {
            return;
        }

        finalResult[directory].push({
            name,
            current: result[item].current,
            wanted: result[item].wanted,
            latest: result[item].latest,
            type: result[item].type,
        });
    });
});

Object.keys(finalResult).forEach(module => console.log(`${module} needs upgrading ...`));
