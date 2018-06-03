const fs = require("fs");
const path = require("path");
const { extract } = require("../src/extractor");
const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

if (!inputPath) {
    throw new Error("You must provide the first argument as an input path");
}

if (!outputPath) {
    throw new Error("You must provide the first argument as an output path");
}

const walkSync = function(dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + "/", filelist);
        } else {
            if (file.indexOf(".js") !== -1 || file.indexOf(".ts") !== -1) {
                filelist.push(dir + file);
            }
        }
    });
    return filelist;
};

function extractLocale(pathToDir, rootPath, outputPath) {
    let locale = [];
    const fileList = [];

    walkSync(pathToDir, fileList);

    fileList.forEach((file, index) => {
        console.log("Parsing " + file + "..." + ("(" + Math.round((index + 1) * 100 / fileList.length) + " %)"));

        const content = fs.readFileSync(file, "utf-8");
        const jsxResult = extract(content, ["Translate"], ["translate", "__"]);

        jsxResult.forEach(item => {
            locale.push({
                term: item.value,
                reference: file + ":" + item.line,
            });
        });
    });

    let blacklist = [];
    let final = [];

    locale.filter(item => !!item.term).forEach(item => {
        if (blacklist.includes(item.term)) {
            const original = final.find(search => search.term === item.term);
            original.reference = original.reference + ", " + item.reference;
            return;
        }

        blacklist.push(item.term);
        final.push(item);
    });

    fs.writeFileSync(outputPath, JSON.stringify(final));
}

extractLocale(path.join(inputPath, "/"), inputPath, path.join(outputPath, "template.json"));
