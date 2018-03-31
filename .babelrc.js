module.exports = {
    plugins: [
        "@babel/plugin-proposal-decorators",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
    ],
    presets: [
        "@babel/preset-env",
        "@babel/preset-react",
    ],
    env: {
        test: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
    },
};
