#!/usr/bin/env node
// -*- mode: js -*-
// vim: set filetype=javascript :

const fs = require("fs");
const path = require("path");
const extractFromCode = require("i18n-extract").extractFromCode;

var walkSync = function(dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + "/", filelist);
        } else {
            if (file.indexOf(".js") !== -1) {
                filelist.push(dir + file);
            }
        }
    });
    return filelist;
};

function extractLocale(basePath, pathToSrc, outputPath) {
    var locale = [];
    var fileList = [];

    walkSync(pathToSrc + "/", fileList);

    function extractTextBetweenTags(startTag, endTag, contents) {
        var tagsMatched = [];
        var list = [];
        startTag = startTag.toLowerCase();
        endTag = endTag.toLowerCase();

        var openTagsPositions = [];
        var tagID = 0;

        for (var pos = 0; pos < contents.length; pos++) {
            if (contents.toLowerCase().substr(pos, startTag.length) === startTag) {
                tagID++;
                openTagsPositions[tagID] = pos;
            }

            if (contents.toLowerCase().substr(pos, endTag.length) === endTag) {
                var result = contents.substring(openTagsPositions[tagID], pos + endTag.length).replace(/\s\s+/g, " ");

                var tmp = result;
                tagsMatched.forEach(item => {
                    tmp = tmp.replace(item, "");
                });

                tagsMatched.push(result);

                var realStartTag = "";
                var openInnerTags = 0;
                for (var internalPos = 0; internalPos < tmp.length; internalPos++) {
                    if (tmp[internalPos] === "<") {
                        openInnerTags++;
                    }
                    if (tmp[internalPos] === ">") {
                        openInnerTags--;

                        if (openInnerTags === 0) {
                            realStartTag = tmp.substring(0, internalPos);
                            break;
                        }
                    }
                }

                var result2 = tmp.substring(realStartTag.length + 1, tmp.length - endTag.length);

                result2 = result2.trim();
                result2 = result2.replace("{'", "");
                result2 = result2.replace("'}", "");
                result2 = result2.replace('{"', "");
                result2 = result2.replace('"}', "");

                if (result2 === "") {
                    tagID--;
                    continue;
                }

                list.push(result2);
                tagID--;
            }
        }

        return list.filter((value, index, self) => self.indexOf(value) === index);
    }

    fileList.forEach((file, index) => {
        console.log("Parsing " + file + "..." + ("(" + Math.round((index + 1) * 100 / fileList.length) + " %)"));

        var content = fs.readFileSync(file, "utf-8");
        var result = extractTextBetweenTags("<Translate", "</Translate>", content, file.split("src")[1]);

        result = result.concat(
            extractFromCode(content, {
                marker: "translate",
            }).map(item => item.key)
        );

        result.forEach(item => {
            locale.push({
                term: item,
                definition: "",
                context: "",
                term_plural: "",
                reference: file.replace(basePath, ""),
                comment: "",
            });
        });
    });

    fs.writeFileSync(outputPath, JSON.stringify(locale));
}

extractLocale(
    process.cwd(),
    path.join(process.cwd(), "src", "modules"),
    path.join(process.cwd(), "resources", "intl", "terms.json")
);

console.log(' ');
console.log('Placing results at "' + path.join(process.cwd(), "resources", "intl", "terms.json") + '"');
