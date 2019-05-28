module.exports = {
    plugins: ["@babel/plugin-syntax-dynamic-import", "babel-plugin-jsx-control-statements"],
    presets: [
        [
            "@babel/preset-env",
            {
                targets: "> 0.25%, not op_mini all",
            },
        ],
        "@babel/preset-react",
    ],
};
