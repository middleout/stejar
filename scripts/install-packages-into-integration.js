const fs = require("fs");
const dirs = require("./getDirectories")("./packages");
var exec = require("child_process").exec;

var run = function(cmd) {
    var child = exec(cmd, function(error, stdout, stderr) {
        if (stderr !== null) {
            console.log("" + stderr);
        }
        if (stdout !== null) {
            console.log("" + stdout);
        }
        if (error !== null) {
            console.log("" + error);
        }
    });
};

dirs.forEach(dir => {
    run("npm install ./packages/" + dir + " --prefix __integration");
});
