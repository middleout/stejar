import path from "path";
import fs from "fs";
import eslintFormatter from "react-dev-utils/eslintFormatter";
import StyleLintPlugin from "stylelint-webpack-plugin";
import WebpackChunkHash from "webpack-chunk-hash";
import { BannerPlugin } from "webpack";
import CircularDependencyPlugin from "circular-dependency-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import {
    output,
    resolve,
    rules as _rules,
    plugins as _plugins,
    cleanOptions,
    stats,
    generateCssLoader,
} from "./webpack.config.common";
import config from "../../app.config";

const _packageJson = fs.readFileSync("./package.json");
const _appVersion = _packageJson.version;

const rules = _rules.slice(0).concat([
    // Cleans up JS code from major errors
    {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        include: path.resolve("./src"),
        use: [
            {
                loader: "eslint-loader",
                options: {
                    formatter: eslintFormatter,
                },
            },
        ],
    },
]);

const plugins = _plugins.slice(0).concat([
    new StyleLintPlugin({
        files: ["**/src/**/*.s?(a|c)ss"],
    }),
    new CircularDependencyPlugin(),
    new CaseSensitivePathsPlugin(),
    new WebpackChunkHash(),
    new ManifestPlugin({
        fileName: "../" + (config.assetsMapFileName || "mappings.json"),
    }),
    new BannerPlugin({
        banner: `
    /*
    * Application Version: ${_appVersion}
    */`,
        raw: true,
        entryOnly: true,
    }),
]);

export { output, resolve, rules, plugins, cleanOptions, stats, generateCssLoader };
