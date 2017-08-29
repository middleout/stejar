import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import { optimize, DefinePlugin } from "webpack";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import { output, stats, rules, plugins, resolve, cleanOptions, generateCssLoader } from "./webpack.config.common.extended";

const defineOpts = {
    process: {
        env: {
            NODE_ENV: JSON.stringify("production"),
        },
    },
};

export default [
    // Browser config
    {
        entry: "./src/client.jsx",
        devtool: false,
        target: "web",
        resolve,
        output: Object.assign({}, output, {
            path: path.resolve("./dist/client"),
            filename: "js/app.[chunkhash].js",
        }),
        module: {
            rules: rules.slice(0).concat([
                {
                    test: /\.scss$/,
                    loader: generateCssLoader(false),
                },
            ]),
        },
        plugins: plugins.slice().concat([
            new CleanWebpackPlugin(["./dist/client"], cleanOptions),
            new DefinePlugin(defineOpts),
            new optimize.CommonsChunkPlugin({
                name: "vendor",
                filename: "js/vendor.[chunkhash].js",
                minChunks: function(module) {
                    return module.request && module.request.indexOf("src") === -1;
                },
            }),
            new FaviconsWebpackPlugin({
                logo: "./src/App/favicon.png", // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
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
            new optimize.UglifyJsPlugin({
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
        ]),
        stats,
    },
    // Server config
    {
        entry: "./src/server.jsx",
        devtool: "source-map",
        target: "node",
        resolve,
        output: Object.assign({}, output, {
            path: path.resolve("./dist/server"),
            filename: "index.js",
            libraryTarget: "commonjs2",
        }),
        externals: /^[a-z\-0-9]+$/,
        module: {
            rules: rules.slice(0).concat([
                {
                    test: /\.scss$/,
                    loader: generateCssLoader(false),
                },
            ]),
        },
        plugins: plugins
            .slice()
            .concat([
                new CleanWebpackPlugin("./dist/server", cleanOptions),
                new CleanWebpackPlugin("./dist/mappings.json"),
                new DefinePlugin(defineOpts),
            ]),
        stats,
    },
];
