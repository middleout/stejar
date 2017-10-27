module.exports = {
    extends: ["eslint:recommended", "prettier"],
    plugins: ["prettier"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
        },
    },
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    rules: {

        "no-console": "off",
    },
};
