#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const args = process.argv;
const target = args[2] || "";

const APP_PATH = path.resolve(target ? target : "./");
if (target !== path.resolve("./") && fs.existsSync(APP_PATH)) {
    throw new Error("Directory already exists: " + APP_PATH);
}

console.log("Creating stejar app into " + APP_PATH);

const USE_YARN = true;
const ENABLE_JEST = true;
const ENABLE_REACT = true;
const ENABLE_ESLINT = true;
const ENABLE_STYLELINT = true;
const ENABLE_PRETTIER = true;
const ENABLE_HUSKY_LINTING = true;
const ENABLE_LINT_STAGED = true;

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
    "*.{js,jsx}": [],
    "*.{scss}": [],
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
    stylelint: {
        extends: "stylelint-config-standard",
        rules: {
            indentation: 4,
        },
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
    jsLintCommands.push('node_modules/.bin/prettier --write "src/**/*.{js,jsx,scss}"');
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
    packageJson.styleLint = styleLintConfig;
}

if (ENABLE_PRETTIER || ENABLE_ESLINT || ENABLE_STYLELINT) {
    scripts.lint = jsLintCommands.concat(sassLintCommands).join(" && ");
}

if (ENABLE_HUSKY_LINTING) {
    devPackages.push("husky");

    lintStagedConfig["*.{js,jsx}"] = jsLintCommands;
    lintStagedConfig["*.{scss}"].push(sassLintCommands);
    lintStagedConfig["*.{js,jsx}"].push("git add");
    lintStagedConfig["*.{scss}"].push("git add");

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

devPackages = devPackages.join(" ");
packages = packages.join(" ");

if (USE_YARN) {
    console.log("Installing dev packages: " + devPackages);
    execSync(`yarn add ${devPackages} --dev`, { cwd: APP_PATH });
    console.log("Installing packages: " + packages);
    execSync(`yarn add ${packages}`, { cwd: APP_PATH });
} else {
    console.log("Installing dev packages: " + devPackages);
    execSync(`npm install ${devPackages} --dev`, { cwd: APP_PATH });
    console.log("Installing packages: " + packages);
    execSync(`npm install ${packages}`, { cwd: APP_PATH });
}

execSync(`npx sort-package-json`, { cwd: APP_PATH });

console.log("Done ! Build an awesome Stejar ! :)");
