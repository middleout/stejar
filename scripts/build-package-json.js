const path = require("path");
const fs = require("fs");
const dirs = require("./common/getDirectories")("./packages");
const appPackageJson = JSON.parse(fs.readFileSync("./package.json"));
const basePackageJson = JSON.parse(fs.readFileSync("./configs/_package.json"));

dirs.forEach(dir => {
    let localPackageJson = {};
    if (fs.existsSync(path.join("./", "packages", dir, "local.package.json"))) {
        localPackageJson = JSON.parse(fs.readFileSync(path.join("./", "packages", dir, "local.package.json")));
    }

    if (!localPackageJson.name) {
        localPackageJson.name = "@" + appPackageJson.name + "/" + dir;
    }

    const finalPackageJson = Object.assign({}, basePackageJson, localPackageJson);

    fs.writeFileSync(path.join("./", "packages", dir, "package.json"), JSON.stringify(finalPackageJson).replace('[name]', dir));

    console.log("Built package json for package: " + dir);
});
