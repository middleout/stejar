global.React = require("React");
import express from "express";
import webpackMiddleware from "webpack-dev-middleware";
import history from "connect-history-api-fallback";
import path from "path";
import fs from "fs";
import config from "./../../configs/appConfig";
import generateWebpackConfig from "./generateWebpackConfig";
import generateWebpackCompiler from "./generateWebpackCompiler";
import generateWebpackDevServerOptions from "./generateWebpackDevServerOptions";

export default function (useDevMiddleware) {
    const pathToCallback = "./src/server.js";

    let callback = () => {
        throw new Error("You must define a Callback for the server script in '" + pathToCallback + "' . ");
    };
    if (fs.existsSync(pathToCallback)) {
        callback = require(path.resolve(pathToCallback));
        if (callback && callback.default) {
            callback = callback.default;
        }
    }

    const app = express();
    const port = config.port;
    const host = config.host;
    const secure = false;
    const webpackConfig = generateWebpackConfig(false);
    const compiler = generateWebpackCompiler(false);
    const opts = { ...generateWebpackDevServerOptions(webpackConfig), serverSideRender: true };
    app.use(history());
    app.use(express.static("./dist/public"));
    if (useDevMiddleware) {
        app.use(webpackMiddleware(compiler, opts));
    }
    app.use((req, res, next) => {
        let assets = {css: [], js: []};

        if (useDevMiddleware) {

            res.locals.webpackStats.toJson()
                .assetsByChunkName
                .vendor
                .filter(item => item.indexOf('.css') !== -1)
                .filter(item => item.indexOf('.css.map') === -1)
                .forEach(item => assets.css.push(item));

            res.locals.webpackStats.toJson()
                .assetsByChunkName
                .main
                .filter(item => item.indexOf('.css') !== -1)
                .filter(item => item.indexOf('.css.map') === -1)
                .forEach(item => assets.css.push(item));

            res.locals.webpackStats.toJson()
                .assetsByChunkName
                .vendor
                .filter(item => item.indexOf('.js') !== -1)
                .filter(item => item.indexOf('.js.map') === -1)
                .forEach(item => assets.js.push(item));

            res.locals.webpackStats.toJson()
                .assetsByChunkName
                .main
                .filter(item => item.indexOf('.js') !== -1)
                .filter(item => item.indexOf('.js.map') === -1)
                .forEach(item => assets.js.push(item));

            return callback(req, res, next, assets);
        }

        const map = JSON.parse(fs.readFileSync("./dist/mappings.json"));
        assets.css.push(map['vendor.css']);
        assets.css.push(map['main.css']);
        assets.js.push(map['vendor.js']);
        assets.js.push(map['main.js']);
        return callback(req, res, next, assets);
    });
    app.listen(port);

    console.log(`Started express server on ${secure ? "https" : "http"}://${host}:${port}`);
}
