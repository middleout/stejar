#!/usr/bin/env node
"use strict";

require("isomorphic-fetch");
var fs = require("fs");
var mkdirp = require("mkdirp");
const args = process.argv.slice(2);
const apiKey = args[0];
const projectId = args[1];
const outputDir = args[2];

if (!apiKey) {
    throw new Error("You must provide the first argument the api key");
}

if (!projectId) {
    throw new Error("You must provide the second argument the project ID");
}

if (!outputDir) {
    throw new Error("You must provide the third argument the output path");
}

function getProjectLanguagesList(projectId) {
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `api_token=${apiKey}&id=${projectId}`,
    };

    return fetch("https://api.poeditor.com/v2/languages/list", opts)
        .then(response => {
            if (response.status >= 400) {
                return response.text().then(err => Promise.reject(err));
            }

            return response.json();
        })
        .then(response => {
            if (response.response.status !== "success") {
                return Promise.reject(response.response);
            }

            return response.result.languages;
        })
        .catch(err => {
            console.error(err);
            console.error("ERROR");

            return Promise.reject(err);
        });
}

function exportProjectLanguage(projectId, code) {
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `api_token=${apiKey}&id=${projectId}&language=${code}&type=json`,
    };

    return fetch("https://api.poeditor.com/v2/projects/export", opts)
        .then(response => {
            if (response.status >= 400) {
                return response.text().then(err => Promise.reject(err));
            }

            return response.json();
        })
        .then(response => {
            if (response.response.status !== "success") {
                return Promise.reject(response.response);
            }

            return response.result;
        })
        .catch(err => {
            console.error(err);
            console.error("ERROR");

            return Promise.reject(err);
        });
}

function downloadFile(url) {
    console.log("Downloading file from " + url);

    return fetch(url)
        .then(response => {
            if (response.status >= 400) {
                return response.text().then(err => Promise.reject(err));
            }

            const fileName = response.headers.get("content-disposition").split('"')[1];

            return response.json().then(data => {
                return {
                    data,
                    filename: fileName,
                };
            });
        })
        .then(response => {
            mkdirp.sync(outputDir);
            fs.writeFileSync(outputDir + "/" + response.filename, JSON.stringify(response.data));
        })
        .catch(err => {
            console.error(err);
            console.error("ERROR");

            return Promise.reject(err);
        });
}

console.log("Starting for project " + projectId + " and api key " + apiKey);

getProjectLanguagesList(projectId)
    .then(data => {
        console.log("Got project languages list (" + data.length);
        return data;
    })
    .then(languages => {
        let promises = [];

        languages.forEach(language => {
            promises.push(
                new Promise(resolve => {
                    console.log("Preparing downlaod for " + language.code);
                    exportProjectLanguage(projectId, language.code).then(data => {
                        console.log("Ready to download " + language.code);
                        resolve(data);
                    });
                })
            );
        });

        return Promise.all(promises);
    })
    .then(results => {
        return results.map(result => result.url);
    })
    .then(urls => {
        return Promise.all(urls.map(url => downloadFile(url)));
    })
    .then(() => {
        console.log("DONE !");
    });
