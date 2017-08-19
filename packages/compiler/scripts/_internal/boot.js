require("babel-register")({
    ignore: /^(?!.*(@stejar|src)).*$/,
    presets: [["es2015"], "stage-0"],
    plugins: [
        "transform-runtime",
        "jsx-control-statements",
        "transform-react-jsx",
        "transform-decorators-legacy",
        ["babel-plugin-transform-require-ignore", { extensions: [".scss"] }],
    ],
});
