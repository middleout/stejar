import fs from "fs";
import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import { optimize, DefinePlugin } from "webpack";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import config from "./../../app.config";
import { output, stats, rules, plugins, resolve, cleanOptions, generateCssLoader } from "./webpack.config.common.extended";

const defineOpts = {
    process: {
        env: {
            NODE_ENV: JSON.stringify("production"),
        },
    },
};

const clientDist = "./" + path.join(config.distDirName || "dist", config.clientDistDirName || "client");
const serverDist = "./" + path.join( config.distDirName || "dist", config.serverDistDirName || "server");

const extraPlugins = [
    new CleanWebpackPlugin(clientDist, cleanOptions),
    new DefinePlugin(defineOpts),
    new optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "js/vendor.[chunkhash].js",
        minChunks: function(module) {
            return module.request && module.request.indexOf("src") === -1;
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
];

if (fs.existsSync("./" + (config.faviconPath || "src/favicon.png"))) {
    extraPlugins.push(new FaviconsWebpackPlugin({
        logo: "./" + (config.faviconPath || "src/favicon.png"), // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
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
    }));
}

export default [
    // Browser config
    {
        entry: "./" + (config.browserEntryFile || "src/client.jsx"),
        devtool: false,
        target: "web",
        resolve,
        output: Object.assign({}, output, {
            path: path.resolve(clientDist ),
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
        plugins: plugins.slice().concat(extraPlugins),
        stats,
    },
    // Server config
    {
        entry: "./" + (config.serverEntryFile || "src/server.jsx"),
        devtool: false,
        target: "node",
        resolve,
        output: Object.assign({}, output, {
            path: path.resolve(serverDist),
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
                new CleanWebpackPlugin(serverDist, cleanOptions),
                new CleanWebpackPlugin( path.resolve("./" + path.join(config.distDirName || "dist", config.assetsMapFileName || "mappings.json")), cleanOptions ),
                new DefinePlugin(defineOpts),
            ]),
        stats,
    },
];
