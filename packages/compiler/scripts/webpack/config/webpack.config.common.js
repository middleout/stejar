import path from "path";
import autoprefixer from "autoprefixer";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { ProvidePlugin } from "webpack";
import WebpackBuildNotifierPlugin from "webpack-build-notifier";
import config from "./../app.config";

const _extensions = [".js", ".jsx", ".ts", ".tsx"];

const output = {
    publicPath: config.publicPath,
};

const resolve = {
    extensions: _extensions,
};

const _cssPlugin = new ExtractTextPlugin({
    filename: "css/app.[hash].css",
    allChunks: true,
});

function generateCssLoader(isDev) {
    return _cssPlugin.extract([
        { loader: "css-loader", options: { importLoaders: 1, sourceMap: isDev, minimize: !isDev } },
        { loader: "postcss-loader", options: { sourceMap: isDev, plugins: [autoprefixer] } },
        "resolve-url-loader",
        { loader: "sass-loader", options: { outputStyle: "expanded", sourceMap: isDev } },
    ]);
}

const rules = [
    // Import source maps also for libraries that have it
    {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader",
    },
    // COnvert JS/JSX to Browser/Server
    {
        test: /\.(js|jsx)$/,
        use: [{ loader: "babel-loader" }],
        exclude: /node_modules/,
    },
    // Static assets convert to URL
    {
        test: /(\.jpg|\.png|\.gif|\.ttf|\.eot|\.svg|\.woff(2))$/,
        loader: "file-loader",
        exclude: /node_modules/,
        options: {
            outputPath: "img/",
            publicPath: config.assetsPublicPath || config.publicPath,
        },
    },
];

const plugins = [
    // HAS TO BE FIRST otherwise you get errors in build (for whatever reason)
    new ProvidePlugin({
        React: "react",
    }),
    _cssPlugin,
    new WebpackBuildNotifierPlugin({
        onClick: () => null,
    }),
];

const cleanOptions = {
    root: path.resolve("./"),
    verbose: true,
    dry: false,
};

const stats = "verbose";

export { output, resolve, rules, plugins, cleanOptions, stats, generateCssLoader };
