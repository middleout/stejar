const { readdirSync, statSync } = require("fs-extra");

module.exports = function getFiles(dir) {
    let results = [];
    const list = readdirSync(dir);
    list.forEach(file => {
        file = dir + "/" + file;
        const stat = statSync(file);
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
