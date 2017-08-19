const path = require("path");
const fs = require("fs");
const { optimize: { UglifyJsPlugin, CommonsChunkPlugin }, DefinePlugin, BannerPlugin } = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const ManifestPlugin = require("webpack-manifest-plugin");
const config = require("./appConfig");
const merge = require("webpack-merge");

const Css = new extractTextPlugin({
    filename: "css/app.[chunkhash].css",
    allChunks: true,
});

function generateCssLoader(isDev) {
    return {
        test: /\.scss$/,
        loader: Css.extract([
            { loader: "css-loader", options: { importLoaders: 1, sourceMap: isDev, minimize: !isDev } },
            { loader: "postcss-loader", options: { sourceMap: isDev, plugins: [require("autoprefixer")] } },
            "resolve-url-loader",
            { loader: "sass-loader", options: { outputStyle: "expanded", sourceMap: isDev } },
        ]),
        // exclude: [/node_modules/],
    };
}

const commonWebpackConfig = {
    entry: [config.entry || "index.tsx"],
    output: {
        path: path.resolve("./dist/public"),
        filename: "js/app.[chunkhash].js",
        publicPath: config.publicPath,
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", '.jsx'],
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.ts|tsx$/,
                enforce: "pre",
                loader: "tslint-loader",
                options: {
                    fix: false,
                    emitErrors: true,
                    failOnHint: false,
                },
            },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader",
            },
            {
                test: require.resolve("react"),
                loader: "expose-loader?React",
            },
            {
                test: /\.(ts|tsx)$/,
                use: ["babel-loader", "ts-loader"],
                exclude: [/node_modules/],
            },
            {
                test: /\.(js|jsx)$/,
                use: ["babel-loader"],
                exclude: [/node_modules/],
            },
            {
                test: /resources\/locales\/(.*)\.json$/,
                loaders: ["file-loader?name=js/intl/[name].[hash].json"],
                exclude: ["node_modules"],
            },
            {
                test: /(\.jpg|\.png|\.gif|\.svg|\.ttf|\.eot|\.svg|\.woff(2))$/,
                loader: "file-loader",
                exclude: [/node_modules/],
            },
        ],
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     hash: false,
        //     inject: false,
        //     filename: "index.html",
        //     template: "./resources/index.ejs",
        //     pageTitle: "<title>Application Title</title>",
        //     prerenderApp: "<div></div>",
        //     appState: "{}",
        // }),
        new CircularDependencyPlugin(),
        new CaseSensitivePathsPlugin(),
        new WebpackChunkHash(),
        new WebpackBuildNotifierPlugin({
            onClick: () => null,
        }),
        new ManifestPlugin({
            fileName: "../mappings.json",
        }),
        new BannerPlugin({
            banner: `
 /*
  * Application Version: 1.0.0
  * Build Version: 1
  */`,
            raw: true,
            entryOnly: true,
        }),
        Css,
    ],
};

const devWebpackConfig = merge({}, commonWebpackConfig, {
    devtool: "source-map",
    module: {
        rules: [
            generateCssLoader(true)
        ],
    },
    plugins: [
        new DefinePlugin({
            "process.env.NODE_ENV": '"development"',
        }),
        new CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.[hash].js",
            minChunks: function(module) {
                return module.request && module.request.indexOf("src") === -1;
            },
        }),
    ],
});

const prodWebpackConfig = merge({}, commonWebpackConfig, {
    devtool: false,
    module: {
        rules: [
            generateCssLoader()
        ],
    },
    plugins: [
        new CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.[chunkhash].js",
            minChunks: function(module) {
                return module.request && module.request.indexOf("src") === -1;
            },
        }),
        new CleanWebpackPlugin(["./dist/public"], {
            root: path.resolve("./"),
            verbose: true,
            dry: false,
        }),
        new FaviconsWebpackPlugin({
            logo: "./resources/favicons/favicon.png", // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: true,
                yandex: true,
                windows: true,
            },
        }),
        new DefinePlugin({
            "process.env.NODE_ENV": '"production"',
        }),
        new UglifyJsPlugin({
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false,
            },
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            output: {
                comments: false,
                screw_ie8: true,
            },
        }),
    ],
});

module.exports = {
    dev: devWebpackConfig,
    prod: prodWebpackConfig,
};
