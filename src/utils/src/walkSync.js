const { readdirSync, statSync } = require("fs");
const { join } = require("path");

module.exports = function walkSync(dir, filelist) {
    const files = readdirSync(dir);
    filelist = filelist || [];
    files.forEach(file => {
        if (statSync(join(dir, file)).isDirectory()) {
            filelist = walkSync(join(dir, file), filelist);
        } else {
            filelist.push(join(dir, file));
        }
    });
    return filelist;
};
