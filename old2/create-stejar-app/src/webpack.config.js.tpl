const dotenv = require("dotenv");
const { clearTerminal } = require("@stejar/clear-terminal");
const path = require("path");
const { ProvidePlugin, DefinePlugin } = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const NodemonPlugin = require("nodemon-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

clearTerminal();
const APP_ENV = dotenv.config().parsed;

module.exports = (env, args) => {
    const mode = args.mode || "development";

    return [
        {
            entry: {
                server: "./src/server.js",
            },
            target: "node",
            output: {
                path: path.resolve("./dist/server"),
                publicPath: APP_ENV.STATIC_URL + "/",
            },
            externals: nodeExternals(),
            plugins: [
                new CleanWebpackPlugin(["./dist/server/*.*"]),
                new NodemonPlugin({
                    script: "./dist/server/server.js",
                }),
            ],
        },
        {
            cache: false, // disabling cache in watch mode for extractCss
            entry: ["@babel/polyfill", "./src/client.js"],
            output: {
                path: path.resolve("./dist/client"),
                publicPath: process.env.STATIC_URL + "/",
            },
            resolve: {
                extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".jsx"],
            },
            devtool: mode === "production" ? false : "inline-source-maps",
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
                        test: /\.(js|jsx|mjs)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                        },
                    },
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: "html-loader",
                                options: { minimize: true },
                            },
                        ],
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: mode === "production" ? false : true,
                                    minimize: mode === "production" ? true : false,
                                },
                            },
                            {
                                loader: "resolve-url-loader",
                                options: {
                                    sourceMap: mode === "production" ? false : true,
                                },
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: mode === "production" ? false : true,
                                },
                            },
                        ],
                    },
                    // General images or fonts
                    {
                        test: /\.(png|jpg|jpeg|svg|woff|woff2|ttf|eot|otf)$/i,
                        exclude: /node_modules/,
                        loaders: ["file-loader"],
                    },
                    // Explicitly for manifest.json favicons
                    {
                        test: /manifest.json/i,
                        type: "javascript/auto",
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
                new DefinePlugin({ APP_ENV: JSON.stringify(APP_ENV) }),
                new MiniCssExtractPlugin({
                    filename: "[name].[hash].css",
                }),
                new CleanWebpackPlugin(["./dist/client/*.*"]),
                new WebpackBuildNotifierPlugin(),
                new AssetsPlugin({
                    path: path.join(__dirname, "dist"),
                    prettyPrint: true,
                }),
            ],
        },
    ];
};
