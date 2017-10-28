const transformEs6ToCommonJs = process.env.BABEL_ENV === "cjs";

const plugins = ["transform-decorators-legacy", "transform-runtime"];

if (process.env.NODE_ENV === "production") {
    plugins.push("dev-expression");
}

module.exports = {
    presets: [
        [
            "env",
            {
                loose: true,
                modules: transformEs6ToCommonJs ? "commonjs" : false,
                targets: {
                    browsers: ["last 2 versions", "safari >= 7"],
                },
            },
        ],
        "stage-1",
    ],
    plugins,
};
