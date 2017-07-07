const path = require("path");

module.exports = {
    entry: "./index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                use: ["source-map-loader"],
                enforce: "pre",
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: JSON.stringify({
                            cacheDirectory: true,
                            presets: [
                                [
                                    "env",
                                    {
                                        targets: {
                                            browsers: ["last 2 versions", "safari >= 7"],
                                        },
                                    },
                                ],
                            ],
                            plugins: ["transform-react-jsx"],
                        }),
                    },
                    {
                        loader: "ts-loader",
                    },
                ],
                exclude: [/node_modules/],
            },
        ],
    },
};
