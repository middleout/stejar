const args = process.argv.slice(2);
const webpackConfigs = require("./../configs/webpack");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const clearConsole = require("react-dev-utils/clearConsole");

let env = undefined;
args.forEach(arg => {
    if (arg.indexOf("--env=") !== -1) {
        env = arg.replace("--env=", "");
    }
});
const isProduction = env === "production";

const compiler = webpack(isProduction ? webpackConfigs.prod : webpackConfigs.dev);

compiler.plugin("invalid", function() {
    console.log("Compiling...");
});

compiler.plugin("done", function(stats) {
    clearConsole();

    var rawMessages = stats.toJson({}, true);
    var messages = formatWebpackMessages(rawMessages);
    if (!messages.errors.length && !messages.warnings.length) {
        console.log("Compiled successfully!");
    }
    if (messages.errors.length) {
        console.log("Failed to compile.");
        messages.errors.forEach(e => console.log(e));
        return;
    }
    if (messages.warnings.length) {
        console.log("Compiled with warnings.");
        messages.warnings.forEach(w => console.log(w));
    }
});

if (isProduction) {
    compiler.run(() => null);
    return;
}

const server = new webpackDevServer(compiler, {
    contentBase: "./dist/public",
    hot: true,
    quiet: false,
    noInfo: true,
    inline: true,
    stats: {
        colors: true,
    },
});

server.listen(8080, "127.0.0.1", function() {
    console.log("Starting server on http://localhost:8080");
});
