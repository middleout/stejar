// This file is needed due to https://github.com/babel/babel/pull/7358
module.exports = {
    plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
    ],
    presets: ["@babel/preset-env", "@babel/preset-react"],
    env: {
        test: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
    },
};
