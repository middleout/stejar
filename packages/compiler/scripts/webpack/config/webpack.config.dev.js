import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import { optimize, DefinePlugin } from "webpack";
import config from "./../../app.config";
import { output, stats, rules, plugins, resolve, cleanOptions, generateCssLoader } from "./webpack.config.common.extended";

const defineOpts = {
    process: {
        env: {
            NODE_ENV: JSON.stringify("development"),
        },
    },
};

const clientDist = path.join("./", config.distDirName || "dist", config.clientDistDirName || "client");
const serverDist = path.join("./", config.distDirName || "dist", config.serverDistDirName || "server");

export default [
    // Browser config
    {
        entry: "./" + (config.browserEntryFile || "src/client.jsx"),
        devtool: "source-map",
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
                    loader: generateCssLoader(true),
                },
            ]),
        },
        plugins: plugins.slice().concat([
            new CleanWebpackPlugin([clientDist], cleanOptions),
            new DefinePlugin(defineOpts),
            new optimize.CommonsChunkPlugin({
                name: "vendor",
                filename: "js/vendor.[chunkhash].js",
                minChunks: function(module) {
                    return module.request && module.request.indexOf("src") === -1;
                },
            }),
        ]),
        stats,
    },
    // Server config
    {
        entry: "./" + (config.serverEntryFile || "src/server.jsx"),
        devtool: "source-map",
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
                    loader: generateCssLoader(true),
                },
            ]),
        },
        plugins: plugins
            .slice()
            .concat([
                new CleanWebpackPlugin(serverDist, cleanOptions),
                new CleanWebpackPlugin( path.join("./", config.distDirName || "dist", config.assetsMapFileName || "mappings.json") ),
                new DefinePlugin(defineOpts),
            ]),
        stats,
    },
];
