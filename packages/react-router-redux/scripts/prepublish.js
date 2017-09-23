const exec = require("child_process").execSync;

const result = exec("eslint", {encoding: "utf-8"});
console.log(result);
const result = exec("npm run build", {encoding: "utf-8"});
console.log(result);
