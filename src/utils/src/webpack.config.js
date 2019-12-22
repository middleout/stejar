const { config } = require("dotenv");
const { DefinePlugin } = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { resolve, join } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AppManifestWebpackPlugin = require("app-manifest-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Table = require("cli-table");
const loadConfig = require("./loadConfig");

module.exports = (webpackEnv, args = {}) => {
    const isStorybook = args.storybook || false;
    const {
        mode = "development",
        faviconPath = "./resources/images/favicon.png",
        outputPath = "./public",
        htmlPath = "./resources/html/index.html",
        devServerPort = 8080,
    } = args;
    const env = config(args.dotenvOptions || undefined).parsed;
    const appConfig = loadConfig(args.appConfigOptions || undefined);
    const isProduction = mode === "production";

    if (!appConfig.app.publicUrl) {
        throw new Error("Missing app config property: app.publicUrl");
    }
    if (!appConfig.app.name) {
        throw new Error("Missing app config property: app.name");
    }
    if (!faviconPath) {
        throw new Error("Missing favicon path");
    }

    // instantiate
    console.log("Starting webpack build with the following config parameters:");

    const table = new Table({
        head: ["Type", "Value"],
        colWidths: [20, 100],
    });
    table.push(["Mode", mode]);
    table.push(["Production", isProduction]);
    table.push(["Storybook mode", isStorybook]);
    table.push(["Favicon Path", faviconPath]);
    table.push(["Output path", outputPath]);
    table.push(["Index.html path", htmlPath]);
    table.push(["Dev Server port", devServerPort]);
    table.push(["App Config", JSON.stringify(appConfig)]);
    table.push(["App Envirnoment", JSON.stringify(env)]);
    console.log(table.toString());

    const plugins = [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),
        // new ProvidePlugin({
        //     React: "react",
        // }),
        new DefinePlugin({
            "process.env": JSON.stringify(env),
            "process.config": JSON.stringify(appConfig),
        }),
        new WebpackBuildNotifierPlugin(),
        new CaseSensitivePathsPlugin({ debug: false }),
    ];

    if (isProduction) {
        plugins.push(
            new AppManifestWebpackPlugin({
                logo: resolve(faviconPath),
                inject: true,
                prefix: appConfig.app.publicUrl + "/favicons/",
                config: {
                    appName: appConfig.app.name,
                },
                output: "favicons/",
                emitStats: true,
            })
        );
        plugins.push(new OptimizeCssAssetsPlugin({}));
    }

    if (!isStorybook) {
        plugins.push(
            new HtmlWebPackPlugin({
                template: htmlPath,
                filename: "./index.html",
            })
        );
        plugins.push(new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: [outputPath] }));
    }

    return {
        meta: {
            config: appConfig,
            env,
            isProduction,
            isStorybook,
            mode,
            faviconPath,
            outputPath,
            htmlPath,
            devServerPort,
        },
        config: {
            optimization: {
                minimizer: [
                    new TerserPlugin({
                        sourceMap: !isProduction,
                    }),
                ],
                splitChunks: {
                    chunks: "all",
                    cacheGroups: {
                        vendor: {
                            test: /node_modules/,
                            chunks: "all",
                            name: "vendor",
                            enforce: true,
                        },
                    },
                },
            },
            entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/index.jsx"],
            resolve: {
                extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
            },
            output: {
                path: resolve("public"),
                filename: "[name].[chunkhash].js",
                chunkFilename: "[name].[chunkhash].js",
                publicPath: appConfig.app.publicUrl + "/",
            },
            devtool: isProduction ? false : "source-map",
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                        },
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: !isProduction,
                                },
                            },
                            {
                                loader: "resolve-url-loader",
                                options: {
                                    sourceMap: !isProduction,
                                },
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true, // REQUIRED: https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#configure-webpack
                                },
                            },
                        ],
                    },
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: "ejs-loader",
                                options: {
                                    minimize: isProduction,
                                },
                            },
                        ],
                    },
                    {
                        test: /resources\/lang\/(.*)\.json$/,
                        type: "javascript/auto",
                        use: {
                            loader: "file-loader",
                            options: {
                                name: "[name].[contenthash].json",
                            },
                        },
                        // exclude: /node_modules/,
                    },
                    {
                        test: /(\.jpg|\.png|\.gif|\.woff(2)|\.woff|\.ttf|\.otf|\.svg|\.eot)$/,
                        use: {
                            loader: "file-loader",
                        },
                        // exclude: /node_modules/,
                    },
                ],
            },
            plugins,
            devServer: {
                contentBase: join(__dirname, outputPath),
                publicPath: "/",
                compress: true,
                host: "0.0.0.0",
                port: devServerPort,
                disableHostCheck: true,
                hot: false,
                inline: false,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
                },
            },
        },
    };
};
