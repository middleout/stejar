var inquirer = require("inquirer");
const newPackage = require("./scripts/new-package");
const symlinks = require("./scripts/setup-symlinks.js");
const getDirs = require("./scripts/getDirectories");

console.log("");
console.log("Welcome to Stejar Command Line Interface");
console.log("");

var questions = [
    {
        type: "list",
        name: "type",
        message: "What would you like to do ?",
        choices: [
                {
                    name: "Create a new stejar package",
                    value: "new",
                },
            {
                name: "Publish current packages to npm",
                value: "publish",
            },
            {
                name: "Build symlinks (configs)",
                value: "symlinks",
            },
            {
                name: "Build package.json files",
                value: "package-json",
            },
            {
                name: "Update package(s) dependencies",
                value: "ncu",
            },
            {
                name: "Clean package(s)",
                value: "clean",
            },
            {
                name: "Install package(s) into the integration environment",
                value: "integration",
            },
        ],
    },
];

inquirer.prompt(questions).then(function(answers) {
    switch (answers["type"]) {
        case "new":
            const question = {
                type: "input",
                name: "name",
                message: "What should the package be called?",
                validate: function(value) {
                    if (value.length < 3) {
                        return "Package name must have more than 3 letters";
                    }

                    const dirs = getDirs("./packages");

                    if (dirs.indexOf(value) !== -1) {
                        return "Package already exists";
                    }

                    return true;
                },
            };

            inquirer.prompt(question).then(function(name) {
                name = name["name"];

                newPackage(name);

                console.log("Built " + name + " package !");

                console.log("Setting up symlinks");

                symlinks(name);

                console.log("Setup symlinks !");

                console.log("Goodbye!");
            });
            break;
        case "symlinks":
            const innerQuestion = {
                type: "list",
                name: "package",
                message: "For what package?",
                choices: [{ name: "-- All @stejar packages --", value: "all" }].concat(
                    getDirs("./packages").map(item => "@stejar/" + item)
                ),
            };

            inquirer.prompt(innerQuestion).then(function(package) {
                package = package["package"];

                package = package.replace("@stejar/", "");
                if (package === "all") {
                    package = "";
                }

                console.log("Setting up symlinks");

                symlinks(package);

                console.log("Setup symlinks !");

                console.log("Goodbye!");
            });
            break;
    }
});
