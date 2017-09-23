const exec = require("child_process").execSync;
const endOfLine = require('os').EOL;

const std = exec("git status -s", {encoding: "utf-8"});

const modified = std.split(endOfLine).filter(item => !!item).filter(item => item.indexOf("../") === -1);

if (modified.length === 0) {
    console.log('Nothing to commit');
    return;
}

modified.forEach(item => {
    const name = item.replace(" M ", "");
    console.log('Adding to git ' + name);
    exec("git add " + name, {encoding: "utf-8"});
});

console.log('Commiting changes ...');
exec("git commit \"Update dependencies\"", {encoding: "utf-8"});
