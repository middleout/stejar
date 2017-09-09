const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== "cjs";
const transformImports = require("babel-plugin-transform-imports");
const fs = require("fs");
const name = JSON.parse(fs.readFileSync("./package.json", 'utf-8')).name;

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
];

if (process.env.NODE_ENV === "production") {
    plugins.push("dev-expression", "transform-react-remove-prop-types");
}

module.exports = {
    presets: [
        [
            "es2015",
            {
                loose: true,
                modules: building ? false : "commonjs",
            },
        ],
        "stage-1",
        "react",
    ],
    plugins: plugins,
};
