require("dotenv").config();
const path = require("path");
const { ProvidePlugin, DefinePlugin } = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const NodemonPlugin = require("nodemon-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
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
                        use: extractSass.extract({
                            use: [
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
                            // use style-loader in development
                            fallback: "style-loader",
                        }),
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
                new DefinePlugin({
                    APP_ENV: JSON.stringify(env),
                }),
                extractSass,
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
