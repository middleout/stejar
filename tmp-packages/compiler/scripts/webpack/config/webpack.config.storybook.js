import { DefinePlugin } from "webpack";
import { stats, rules, plugins, resolve, generateCssLoader } from "./webpack.config.common";

const defineOpts = {
    process: {
        env: {
            NODE_ENV: JSON.stringify("development"),
        },
    },
};

export default {
    devtool: "source-map",
    resolve,
    module: {
        rules: rules.slice(0).concat([
            {
                test: /\.scss$/,
                loader: generateCssLoader(true),
            },
        ]),
    },
    plugins: plugins.slice().concat([new DefinePlugin(defineOpts)]),
    stats,
};
