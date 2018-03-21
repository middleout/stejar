const fs = require("fs");
const {execSync} = require("child_process");

const APP_PATH = "./app"; // TODO: Change where to create the app
const USE_YARN = true;
const ENABLE_JEST = true;
const ENABLE_REACT = true;
const ENABLE_STATIC_SERVER = true;
const ENABLE_ESLINT = true;
const ENABLE_PRETTIER = true;
const ENABLE_HUSKY = true;

let devPackages = [
    "@babel/core",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-decorators",
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
    "extract-text-webpack-plugin@next", // TODO Still needed due to an error
    "clean-webpack-plugin",
    "webpack-build-notifier",
    "webpack",
    "webpack-cli",
    "node-sass",
];
let packages = [];
let scripts = {
    "start": "webpack --mode development --watch --progress --hide-modules",
    "build": "webpack --mode production",
};
let lintCommands = [];
let packageJson = {
    "name": "stejar-app",
    "version": "1.0.0",
}
let babelRc = {
    "sourceMaps": "inline",
    "plugins": [
        "autobind-class-methods",
        "@babel/plugin-proposal-decorators",
        "@babel/plugin-proposal-class-properties"
    ],
    "presets": ["@babel/preset-env"]
}
let indexFile = `
    import { createElement } from "react";
    import { render } from "react-dom";
    
    render(createElement(() => <div>Hello World</div>), document.getElementById("app"));
    
    const a = async () => {
        await Promise.resolve();
    };
    
    a().then(() => {
        console.warn("b");
    });
`;

let htmlFile = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>webpack 4 quickstart</title>
    </head>
    <body>
        <div id="app">
        </div>
    </body>
    </html>
`;

let editorConfigFile = `
    root = true
    
    [*]
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
    
    [*.{js,jsx,json}]
    charset = utf-8
    indent_style = space
    indent_size = 4
    insert_final_newline = true
`;

let envFile = `
    BASE_URL = //localhost:9080
    STATIC_URL = //localhost:9080
`;

let webpackConfig = `
    require("dotenv").config();
    const { ProvidePlugin, DefinePlugin } = require("webpack");
    const CleanWebpackPlugin = require("clean-webpack-plugin");
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const HtmlWebPackPlugin = require("html-webpack-plugin");
    const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
    const extractSass = new ExtractTextPlugin({
        filename: "[name].[contenthash].css",
        disable: process.env.NODE_ENV === "development",
    });
    
    (function clearTerminal() {
        process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
    })();
    
    const env = {
        BASE_URL: process.env.BASE_URL,
        STATIC_URL: process.env.STATIC_URL,
    };
    
    module.exports = {
        entry: ["@babel/polyfill", "./src/index.jsx"],
        output: {
            publicPath: process.env.STATIC_URL + "/",
        },
        resolve: {
            extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".jsx"],
        },
        devtool: "inline-source-map",
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /node_modules/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\\.(js|jsx|mjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: { minimize: true },
                        },
                    ],
                },
                {
                    test: /\\.scss$/,
                    use: extractSass.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "resolve-url-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                        ],
                        // use style-loader in development
                        fallback: "style-loader",
                    }),
                },
                // General images or fonts
                {
                    test: /\\.(png|jpg|jpeg|svg|woff|woff2|ttf|eot|otf)$/i,
                    exclude: /node_modules/,
                    loaders: ["file-loader"],
                },
                // Explicitly for manifest.json favicons
                {
                    test: /manifest.json/i,
                    type: 'javascript/auto',
                    exclude: /node_modules/,
                    loaders: ["file-loader"],
                },
            ],
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html",
            }),
            new ProvidePlugin({
                React: "react",
            }),
            new DefinePlugin({
                APP_ENV: JSON.stringify(env),
            }),
            extractSass,
            new CleanWebpackPlugin(["./dist/*.*"]),
            new WebpackBuildNotifierPlugin(),
        ],
    };
`;
let gitIgnore = `
    # Webstorm
    .idea
    
    # Logs
    logs
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    
    # Runtime data
    pids
    *.pid
    *.seed
    *.pid.lock
    
    # Directory for instrumented libs generated by jscoverage/JSCover
    lib-cov
    
    # Coverage directory used by tools like istanbul
    coverage
    
    # nyc test coverage
    .nyc_output
    
    # Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
    .grunt
    
    # Bower dependency directory (https://bower.io/)
    bower_components
    
    # node-waf configuration
    .lock-wscript
    
    # Compiled binary addons (http://nodejs.org/api/addons.html)
    build/Release
    
    # Dependency directories
    node_modules/
    jspm_packages/
    
    # Typescript v1 declaration files
    typings/
    
    # Optional npm cache directory
    .npm
    
    # Optional eslint cache
    .eslintcache
    
    # Optional REPL history
    .node_repl_history
    
    # Output of 'npm pack'
    *.tgz
    
    # Yarn Integrity file
    .yarn-integrity
    
    # dotenv environment variables file
    .env
    
    # webpack
    dist/
`;

let eslintConfig = {
    extends: ["eslint:recommended", "prettier", "prettier/react"],
    plugins: [],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    },
    globals: {},
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        "no-console": "off"
    }
}

if (ENABLE_JEST) {
    devPackages.push("jest@22.4.3"); // TODO: needed to due error on facebook side
    devPackages.push("babel-jest");
    scripts = Object.assign(scripts, {
        "test": "jest --watchAll --no-watchman",
        "test:coverage": "jest --watchAll --no-watchman --coverage",
    });
    eslintConfig.env.jest = true;
    packageJson.jest = {
        testMatch: [
            "<rootDir>/src/**/*.test.js?(x)"
        ],
        // transform: {
        //     ".js$": "babel-jest",
        //     ".jsx$": "babel-jest"
        // },
        collectCoverageFrom: [
            "**/src/**/*.{js,jsx}",
            "!**/src/**/*.test.{js,jsx}",
            "!**/node_modules/**"
        ]
    }
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
        eslintConfig.rules["react/jsx-no-undef"] = [
            2, {"allowGlobals": true}
        ];
    }

    packages.push("react");
    packages.push("react-dom");
    packages.push("dotenv");
    packages.push("react-helmet");
}

if (ENABLE_PRETTIER) {
    devPackages.push("prettier");
    devPackages.push("eslint-config-prettier");
    lintCommands.push("prettier --write src/**/*.[js|jsx]");
    packageJson.prettier = {
        printWidth: 120,
        tabWidth: 4,
        trailingComma: "es5",
    }
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
    lintCommands.push("eslint src/**/*.[js|jsx]");
    packageJson.eslintConfig = eslintConfig
}

if (ENABLE_STATIC_SERVER) {
    devPackages.push("static-server");
    scripts.server = "static-server ./dist -p 9080"
}

if (ENABLE_PRETTIER || ENABLE_ESLINT) {
    scripts.lint = lintCommands.join(" && ");
}

if (ENABLE_HUSKY) {
    scripts.precommit = "yarn lint";
    devPackages.push("husky");
}

packageJson.scripts = scripts;

fs.mkdirSync(APP_PATH);
fs.writeFileSync(`${APP_PATH}/package.json`, JSON.stringify(packageJson, null, 2));
fs.writeFileSync(`${APP_PATH}/.babelrc`, JSON.stringify(babelRc, null, 2));
fs.mkdirSync(`${APP_PATH}/src`);
fs.writeFileSync(`${APP_PATH}/src/index.jsx`, indexFile);
fs.writeFileSync(`${APP_PATH}/src/index.html`, htmlFile);
fs.writeFileSync(`${APP_PATH}/.editorconfig`, editorConfigFile);
fs.writeFileSync(`${APP_PATH}/.gitignore`, gitIgnore);
fs.writeFileSync(`${APP_PATH}/.env`, envFile);
fs.writeFileSync(`${APP_PATH}/.env.dist`, envFile);
fs.writeFileSync(`${APP_PATH}/webpack.config.js`, webpackConfig);

devPackages = devPackages.join(" ");
packages = packages.join(" ");

if (USE_YARN) {
    execSync(`yarn add ${devPackages} --dev`, {cwd: APP_PATH});
    execSync(`yarn add ${packages}`, {cwd: APP_PATH});
} else {
    execSync(`npm install ${devPackages} --dev`, {cwd: APP_PATH});
    execSync(`npm install ${packages}`, {cwd: APP_PATH});
}

console.log("DONE !");
