#!/usr/bin/env node

const chalk = require("chalk");
const program = require("commander");
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
let APP_PATH = undefined;
let USE_YARN = true;
let ENABLE_JEST = true;
let ENABLE_REACT = true;
let ENABLE_ESLINT = true;
let ENABLE_STYLELINT = true;
let ENABLE_PRETTIER = true;
let ENABLE_HUSKY_LINTING = true;
let ENABLE_LINT_STAGED = true;

program
    .version(require("./../package.json").version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action(name => (APP_PATH = name))
    .option("--version", "Show version")
    .option("-v, --verbose", "Show additional logs")
    .option("--use-npm", "Use NPM client")
    .option("--no-jest", "Disable JEST testing")
    .option("--no-react", "Disable all react related items")
    .option("--no-eslint", "Disable all eslint related items")
    .option("--no-stylelint", "Disable all stylelint related items")
    .option("--no-prettier", "Disable all prettier related items")
    .option("--no-husky", "Disable all husky related items")
    .option("--no-lint-staged", "Disable all lint-staged related items")
    .on("--help", () => {
        console.log(`    Only ${chalk.green("<project-directory>")} is required.`);
        console.log();
    })
    .parse(process.argv);

if (typeof APP_PATH === "undefined") {
    console.error("Please specify the project directory:");
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`);
    console.log();
    console.log("For example:");
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green("my-stejar-app")}`);
    console.log();
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
    process.exit(1);
}

if (program.useNpm) {
    USE_YARN = false;
}
if (!program.jest) {
    ENABLE_JEST = false;
}
if (!program.react) {
    ENABLE_REACT = false;
}
if (!program.eslint) {
    ENABLE_ESLINT = false;
}
if (!program.stylelint) {
    ENABLE_STYLELINT = false;
}
if (!program.prettier) {
    ENABLE_PRETTIER = false;
}
if (!program.husky) {
    ENABLE_HUSKY_LINTING = false;
}
if (!program.lintStaged) {
    ENABLE_LINT_STAGED = false;
}

if (USE_YARN) {
    console.debug("[DEBUG] Using YARN client...");
} else {
    console.debug("[DEBUG] Using NPM client...");
}
if (!ENABLE_JEST) {
    console.debug("[DEBUG] Will not install Jest...");
}
if (!ENABLE_REACT) {
    console.debug("[DEBUG] Will not install React...");
}
if (!ENABLE_ESLINT) {
    console.debug("[DEBUG] Will not install Eslint...");
}
if (!ENABLE_STYLELINT) {
    console.debug("[DEBUG] Will not install Stylelint...");
}
if (!ENABLE_PRETTIER) {
    console.debug("[DEBUG] Will not install Prettier...");
}
if (!ENABLE_HUSKY_LINTING) {
    console.debug("[DEBUG] Will not install Husky...");
}
if (!ENABLE_LINT_STAGED) {
    console.debug("[DEBUG] Will not install Lint Staged...");
}

console.log("");
console.log("--- Creating stejar app into " + APP_PATH + " ---");
console.log("");

let devPackages = [
    "@babel/core",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-decorators",
    "@babel/plugin-proposal-object-rest-spread",
    "babel-plugin-autobind-class-methods",
    "@babel/polyfill",
    "@babel/preset-env",
    "babel-core@7.0.0-bridge.0",
    "babel-loader",
    "file-loader",
    "html-loader",
    "sass-loader",
    "css-loader",
    "style-loader",
    "resolve-url-loader",
    "html-webpack-plugin",
    // "extract-text-webpack-plugin@next", // TODO Still needed due to an error
    "mini-css-extract-plugin",
    "clean-webpack-plugin",
    "webpack-build-notifier",
    "webpack",
    "webpack-cli",
    "node-sass",
    "express",
    "nodemon",
    "nodemon-webpack-plugin",
    "webpack-node-externals",
    "assets-webpack-plugin",
];
let packages = [];
let scripts = {
    start: "webpack --mode development --watch --progress --hide-modules",
    build: "webpack --mode production",
};
let jsLintCommands = [];
let sassLintCommands = [];

let packageJson = {
    name: "stejar-app",
    private: true,
    version: "1.0.0",
};
let babelRc = {
    sourceMaps: "inline",
    plugins: [
        "autobind-class-methods",
        "@babel/plugin-proposal-decorators",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
    ],
    presets: ["@babel/preset-env"],
};

let clientFile = fs.readFileSync(path.resolve(__dirname) + "/client.js.tpl");
let serverFile = fs.readFileSync(path.resolve(__dirname) + "/server.js.tpl");
let cssFile = fs.readFileSync(path.resolve(__dirname) + "/index.scss.tpl");
let htmlFile = fs.readFileSync(path.resolve(__dirname) + "/index.html.tpl");
let editorConfigFile = fs.readFileSync(path.resolve(__dirname) + "/.editorconfig.tpl");
let envFile = fs.readFileSync(path.resolve(__dirname) + "/.env.tpl");
let webpackConfig = fs.readFileSync(path.resolve(__dirname) + "/webpack.config.js.tpl");
let gitIgnore = fs.readFileSync(path.resolve(__dirname) + "/.gitignore.tpl");

let lintStagedConfig = {
    "src/**/*.{js,jsx}": [],
    "src/**/*.scss": [],
};

let eslintConfig = {
    extends: ["eslint:recommended", "prettier", "prettier/react"],
    plugins: [],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
    },
    globals: {},
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        "no-console": "off",
    },
};

let styleLintConfig = {
    extends: "stylelint-config-standard",
    rules: {
        indentation: 4,
    },
};

if (ENABLE_JEST) {
    devPackages.push("jest@22.4.3"); // TODO: needed to due error on facebook side
    devPackages.push("babel-jest");
    scripts = Object.assign(scripts, {
        test: "jest --watchAll --no-watchman",
        "test:coverage": "jest --watchAll --no-watchman --coverage",
    });
    eslintConfig.env.jest = true;
    packageJson.jest = {
        testMatch: ["<rootDir>/src/**/*.test.js?(x)"],
        // transform: {
        //     ".js$": "babel-jest",
        //     ".jsx$": "babel-jest"
        // },
        collectCoverageFrom: ["**/src/**/*.{js,jsx}", "!**/src/**/*.test.{js,jsx}", "!**/node_modules/**"],
    };
}

if (ENABLE_REACT) {
    devPackages.push("@babel/preset-react");
    devPackages.push("babel-plugin-jsx-control-statements");

    babelRc.plugins.unshift("jsx-control-statements");
    babelRc.presets.push("@babel/preset-react");

    if (ENABLE_ESLINT) {
        devPackages.push("eslint-plugin-react");
        devPackages.push("eslint-plugin-jsx-control-statements");

        eslintConfig.extends.push("plugin:react/recommended");
        eslintConfig.plugins.push("react");
        eslintConfig.plugins.push("jsx-control-statements");
        eslintConfig.parserOptions.ecmaFeatures.jsx = true;
        eslintConfig.globals.If = true;
        eslintConfig.rules["react/react-in-jsx-scope"] = "off";
        eslintConfig.rules["react/prop-types"] = "off";
        eslintConfig.rules["react/jsx-no-undef"] = [2, { allowGlobals: true }];
    }

    packages.push("react");
    packages.push("react-dom");
    packages.push("dotenv");
    packages.push("react-helmet");
}

if (ENABLE_PRETTIER) {
    devPackages.push("prettier");
    devPackages.push("eslint-config-prettier");
    jsLintCommands.push('node_modules/.bin/prettier --write "src/**/*.{js,jsx}"');
    packageJson.prettier = {
        printWidth: 120,
        tabWidth: 4,
        trailingComma: "es5",
    };
    if (ENABLE_REACT) {
        packageJson.prettier.jsxBracketSameLine = true;
    }

    if (ENABLE_ESLINT) {
        eslintConfig.extends.push("prettier");

        if (ENABLE_REACT) {
            eslintConfig.extends.push("prettier/react");
        }
    }
}

if (ENABLE_ESLINT) {
    devPackages.push("babel-eslint");
    devPackages.push("eslint");
    jsLintCommands.push('node_modules/.bin/eslint "src/**/*.{js,jsx}"');
    packageJson.eslintConfig = eslintConfig;
}

if (ENABLE_STYLELINT) {
    devPackages.push("stylelint");
    devPackages.push("stylelint-config-standard");
    sassLintCommands.push('node_modules/.bin/stylelint "src/**/*.scss"');
    packageJson.stylelint = styleLintConfig;
}

if (ENABLE_PRETTIER || ENABLE_ESLINT || ENABLE_STYLELINT) {
    scripts.lint = jsLintCommands.concat(sassLintCommands).join(" && ");
}

if (ENABLE_HUSKY_LINTING) {
    devPackages.push("husky");

    lintStagedConfig["src/**/*.{js,jsx}"] = jsLintCommands;
    lintStagedConfig["src/**/*.scss"] = sassLintCommands;
    lintStagedConfig["src/**/*.{js,jsx}"].push("git add");
    lintStagedConfig["src/**/*.scss"].push("git add");

    packageJson["lint-staged"] = lintStagedConfig;

    if (ENABLE_LINT_STAGED) {
        scripts.precommit = "lint-staged";
        devPackages.push("lint-staged");
    } else {
        scripts.precommit = "yarn lint";
    }
}

packageJson.scripts = scripts;

console.log("Setting up filesystem...");
if (!fs.existsSync(APP_PATH)) {
    fs.mkdirSync(APP_PATH);
}
fs.writeFileSync(`${APP_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
fs.writeFileSync(`${APP_PATH}/.babelrc`, JSON.stringify(babelRc, null, 2));
fs.mkdirSync(`${APP_PATH}/src`);
fs.writeFileSync(`${APP_PATH}/src/client.js`, clientFile);
fs.writeFileSync(`${APP_PATH}/src/server.js`, serverFile);
fs.writeFileSync(`${APP_PATH}/src/index.scss`, cssFile);
fs.writeFileSync(`${APP_PATH}/src/index.html`, htmlFile);
fs.writeFileSync(`${APP_PATH}/.editorconfig`, editorConfigFile);
fs.writeFileSync(`${APP_PATH}/.gitignore`, gitIgnore);
fs.writeFileSync(`${APP_PATH}/.env`, envFile);
fs.writeFileSync(`${APP_PATH}/.env.dist`, envFile);
fs.writeFileSync(`${APP_PATH}/webpack.config.js`, webpackConfig);
console.log("Done !");
console.log("");

devPackages = devPackages.join(" ");
packages = packages.join(" ");

if (USE_YARN) {
    console.log("Installing dev packages ... This might take a while ... ");
    execSync(`yarn add ${devPackages} --dev`, { cwd: APP_PATH });
    console.log("Done !");
    console.log("");
    console.log("Installing packages ...");
    console.log("Done !");
    console.log("");
    execSync(`yarn add ${packages}`, { cwd: APP_PATH });
} else {
    console.log("Installing dev packages ... This might take a while ... ");
    execSync(`npm install ${devPackages} --dev`, { cwd: APP_PATH });
    console.log("Installing packages ...");
    execSync(`npm install ${packages}`, { cwd: APP_PATH });
}

execSync(`npx sort-package-json`, { cwd: APP_PATH });

console.log("");
console.log("Everything looks good ! Build an awesome Stejar ! :)");
