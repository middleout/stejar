const exec = require("child_process").exec;

const result = exec("npm run build", {encoding: "utf-8"});
console.log(result);
