#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { extract } = require("../es/extractor");
const args = process.argv.slice(2);
let inputPath = args[0] || "resources/assets";
let outputPath = args[1] || "resources/lang/terms.json";
const extensions = args[2] || ".js,.jsx,.ts,.tsx";

if (!inputPath) {
    throw new Error("You must provide the first argument as an input path");
}

if (!outputPath) {
    throw new Error("You must provide the first argument as an output path");
}

inputPath = path.resolve(inputPath);
outputPath = path.resolve(outputPath);

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

function extractLocale(pathToDir, rootPath, outputPath, extensions) {
    let locale = [];
    const fileList = [];
    const exts = extensions.split(",");

    walkSync(pathToDir, fileList);

    fileList.forEach((file, index) => {
        const fileExt = path.extname(file);
        if (!exts.includes(fileExt)) {
            return;
        }

        console.log("Parsing " + file + "..." + ("(" + Math.round(((index + 1) * 100) / fileList.length) + " %)"));

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

    locale
        .filter(item => !!item.term)
        .forEach(item => {
            if (blacklist.includes(item.term)) {
                const original = final.find(search => search.term === item.term);
                original.reference = original.reference + ", " + item.reference;
                return;
            }

            blacklist.push(item.term);
            final.push(item);
        });

    if (fs.existsSync(outputPath)) {
        const content = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

        content.forEach(existingItem => {
            let found = false;
            final.forEach(reactItem => {
                if (existingItem.term === reactItem.term) {
                    found = true;
                }
            });

            if (!found) {
                final.push(existingItem);
            }
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(final));
}

extractLocale(path.join(inputPath, "/"), inputPath, outputPath, extensions);
