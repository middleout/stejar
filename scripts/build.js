const { copySync } = require("fs-extra");
const rimraf = require("rimraf");
const nanomatch = require("nanomatch");
const getDirectoriesSync = require("../src/utils/src/getDirectoriesSync");
const getFilesSync = require("../src/utils/src/getFilesSync");
const exec = require("./../src/utils/src/exec");
const args = process.argv;
const target = (args[2] || "").replace("@stejar/", "");

const dirs = getDirectoriesSync("./src")
    .filter(item => !target || item == target)
    .filter(item => item[0] !== "_");

dirs.forEach(dir => {
    console.log(`Building ${dir} \n--`);
    rimraf.sync("src/${dir}/es");
    exec(`babel src/${dir}/src -d src/${dir}/es --ignore tests`);

    nanomatch(getFilesSync(`src/${dir}/src`), "**/*.d.ts").forEach(path => {
        copySync(path, path.replace(`src/${dir}/src`, `src/${dir}/es`));
    });

    console.info(`Built ${dir} !\n--`);
    console.log(`\n`);
});
