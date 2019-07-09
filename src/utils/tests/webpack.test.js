const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("../src/webpack.config");

describe("webpack", () => {
    test("it can work", () => {
        const { config } = webpackConfig("development", {
            appConfigOptions: {
                path: path.resolve(path.join(__dirname, "./config")),
            },
            dotenvOptions: {
                path: path.resolve(path.join(__dirname, "./.env")),
            },
        });
        expect(config.entry[1]).toBe("./src/index.jsx");
    });
});
