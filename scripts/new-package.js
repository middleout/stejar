const fs = require("fs");
const path = require("path");

if (!process.argv[2]) {
    throw new Error("You must provide the package name");
}

const packageName = process.argv[2];
const packagePath = path.join("packages", packageName);

if (fs.existsSync(packagePath)) {
    throw new Error("Package already exists");
}

fs.mkdirSync(packagePath);
const packageJson = {
    version: "2.0.0",
    description: "",
    dependencies: {},
};

fs.writeFileSync(path.join(packagePath, "local.package.json"), JSON.stringify(packageJson));
fs.writeFileSync(path.join(packagePath, "README.md"), `<p align="center">
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
fs.mkdirSync(path.join(packagePath, "src"));
fs.mkdirSync(path.join(packagePath, "__tests__"));

fs.writeFileSync(path.join(packagePath, "src", "index.ts"), "");
fs.writeFileSync(path.join(packagePath, "__tests__", "index.test.ts"), "");
