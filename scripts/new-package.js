const fs = require("fs");
const path = require("path");

if (!process.argv[2]) {
    throw new Error("You must provide the package name");
}

const packageName = path.join("packages", process.argv[2]);

if (fs.existsSync(packageName)) {
    throw new Error("Package already exists");
}

fs.mkdirSync(packageName);
const packageJson = {
    version: "2.0.0",
    description: "",
    dependencies: {},
};

fs.writeFileSync(path.join(packageName, "local.package.json"), JSON.stringify(packageJson));
fs.writeFileSync(path.join(packageName, "README.md"), `<p align="center">
  <a href="https://github.com/middleout/stejar/tree/master/packages/${packageName}">
    <img alt="${packageName}" src="https://s3-eu-west-1.amazonaws.com/stejar/stejar-logo.png" width="144">
  </a>
</p>

<h3 align="center">
	Stejar ${packageName}
</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@stejar/${packageName}"><img src="https://img.shields.io/npm/v/@stejar/${packageName}.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@stejar/${packageName}"><img src="https://img.shields.io/npm/dm/@stejar/${packageName}.svg?style=flat-square"></a>
</p>

<p align="center">
  Description ...
</p>`);
fs.mkdirSync(path.join(packageName, "src"));
fs.mkdirSync(path.join(packageName, "__tests__"));

fs.writeFileSync(path.join(packageName, "src", "index.ts"), "");
fs.writeFileSync(path.join(packageName, "__tests__", "index.test.ts"), "");
