require('colors')
var fs = require("fs");
var jsdiff = require('diff');

var one = JSON.parse(fs.readFileSync("./packages/router/package.json", "utf-8"));
var other = JSON.parse(fs.readFileSync("./packages/react-router/package.json", "utf-8"));

// var diff = jsdiff.diffChars(one, other);
var diff = jsdiff.diffJson(one, other);

diff.forEach(function(part){
    // green for additions, red for deletions
    // grey for common parts
    var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
    process.stderr.write(part.value[color]);
});

console.log()
