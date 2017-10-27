const BABEL_ENV = process.env.BABEL_ENV;
const enableModules = !(BABEL_ENV != undefined && BABEL_ENV !== "cjs");

const plugins = ["transform-decorators-legacy", "transform-runtime"];

if (process.env.NODE_ENV === "production") {
    plugins.push("dev-expression", "transform-react-remove-prop-types");
}

module.exports = {
    presets: [
        [
            "env",
            {
                loose: true,
                modules: enableModules ? "commonjs" : false,
                targets: {
                    browsers: ["last 2 versions", "safari >= 7"],
                },
            },
        ],
        "stage-1",
    ],
    plugins,
};
