const generateWebpackConfig = require("./generateWebpackConfig");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const clearConsole = require("react-dev-utils/clearConsole");
const webpack = require("webpack");

module.exports = function generateWebpackCompiler(isProduction) {
    const compiler = webpack(generateWebpackConfig(isProduction));

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

    return compiler;
};
