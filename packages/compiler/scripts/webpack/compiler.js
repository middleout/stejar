import webpack from "webpack";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import clearConsole from "react-dev-utils/clearConsole";
import { config as loadEnvConfig } from "dotenv";

// load DOTENV
loadEnvConfig();

export default function(env, callback) {
    //The browser/server configuration
    const webpackConfig = require(`./config/webpack.config.${env}.js`).default;

    // The actual webpack compiler
    const compiler = webpack(webpackConfig);

    // These will be used later on to map the JS/CSS files
    let assets = {};

    // After each compilation do this before anything else
    compiler.plugin("done", stats => {
        clearConsole();

        var rawMessages = stats.toJson({}, true);
        var messages = formatWebpackMessages(rawMessages);

        if (!messages.errors.length && !messages.warnings.length) {
            console.log("Compiled successfully!");
        }
        if (messages.errors.length) {
            console.log("Failed to compile.");
            messages.errors.forEach(e => console.log(e));
            if (env === "build") process.exit(1);
            return;
        }
        if (messages.warnings.length) {
            console.log("Compiled with warnings.");
            messages.warnings.forEach(w => console.log(w));
            if (env === "build") process.exit(1);
        }

        const data = stats.toJson();

        Object.keys(data.children[0].assetsByChunkName).forEach(name => {
            const assetsData = Array.isArray(data.children[0].assetsByChunkName[name]) ? data.children[0].assetsByChunkName[name] : [data.children[0].assetsByChunkName[name]];

            assetsData.forEach(item => {
                if (item.indexOf(".js") !== -1) {
                    if (item.indexOf(".map") == -1) {
                        assets[name + ".js"] = item;
                    }
                }

                if (item.indexOf(".css") !== -1) {
                    if (item.indexOf(".map") == -1) {
                        assets[name + ".css"] = item;
                    }
                }
            });
        });
    });

    return {
        run: () => compiler.run(() => callback.bind(null, assets)),
        watch: () => compiler.watch({}, callback.bind(null, assets)),
    };
}
