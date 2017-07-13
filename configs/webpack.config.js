const path = require("path");
const { optimize: { UglifyJsPlugin }, DefinePlugin } = require.main.require("webpack");
const CaseSensitivePathsPlugin = require.main.require("case-sensitive-paths-webpack-plugin");
const CircularDependencyPlugin = require.main.require("circular-dependency-plugin");
const nodeExternals = require.main.require("webpack-node-externals");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve("lib"),
        filename: "index.js",
        sourceMapFilename: "index.map.js",
        libraryTarget: "commonjs2",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx"],
    },
    target: "web",
    externals: [nodeExternals()],
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
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "ts-loader",
                    },
                ],
                exclude: [/node_modules/],
            },
        ],
    },
    plugins: [
        new CircularDependencyPlugin(),
        new CaseSensitivePathsPlugin(),
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
};
