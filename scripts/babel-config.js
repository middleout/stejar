const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== "cjs";
const transformImports = require("babel-plugin-transform-imports");
const fs = require("fs");
const name = JSON.parse(fs.readFileSync("./package.json", "utf-8")).name;

const plugins = [
    [
        transformImports,
        {
            [name]: {
                transform: building ? name + "/es/${member}" : name + "/${member}",
                preventFullImport: true,
            },
        },
    ],
    "transform-decorators-legacy",
    "transform-runtime",
];

if (process.env.NODE_ENV === "production") {
    plugins.push("dev-expression", "transform-react-remove-prop-types");
}

module.exports = enableModules => {
    return {
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
            "react",
        ],
        plugins,
    };
};
