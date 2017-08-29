import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import { optimize, DefinePlugin } from "webpack";
import { output, stats, rules, plugins, resolve, cleanOptions, generateCssLoader } from "./webpack.config.common.extended";

const defineOpts = {
    process: {
        env: {
            NODE_ENV: JSON.stringify("development"),
        },
    },
};

export default [
    // Browser config
    {
        entry: "./src/client.jsx",
        devtool: "source-map",
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
                    loader: generateCssLoader(true),
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
            rules: rules.slice(0)
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
