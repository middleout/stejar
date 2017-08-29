import path from "path";
import express from "express";
import openBrowser from 'react-dev-utils/openBrowser';
import createWebpackCompiler from "./webpack/compiler";
import config from "./app.config";

let server;
let browserWasOpened = false;

function defaultStartScript(response, assetsMap) {
    response.send(`
        <html>
          <head>
            <link type="text/css" href="${assetsMap["main.css"]}" rel="stylesheet" media="all" />
          </head>
          <body>
            <div id="root"></div>
            <script src="${assetsMap["vendor.js"]}"></script>
            <script src="${assetsMap["main.js"]}"></script>
          </body>
        </html>
    `);
}

/**
 * This is the main file that handles the DEVELOPMENT server.
 *
 * Start the webpack compiler. It will send us the assets list.
 * Once the compiler compiles, (re)start the express server.
 *
 * The express server will serve all static asssets from dist/client
 * and will render the HTML from the dist/server/index.js
 */
const compiler = createWebpackCompiler("dev", assetsMap => {

    if (config.startScriptPath) {
        let script = require(path.resolve("./" + config.startScriptPath));
        if (script.default) {
            script = script.default;
        }

        script(assetsMap);
        return;
    }

    // Default static server without server side rendering
    const app = express();

    if (server) {
        server.close();
    }

    // Serve static assets (js/css/img/fonts)
    const clientDistDir = path.join(config.distDirName || "dist", config.clientDistDirName || "client");
    app.use(express.static(clientDistDir));
    app.get("*", (req, res) => defaultStartScript(res, assetsMap));
    server = app.listen(3000, () => {
        console.log("Listening on port %d", server.address().port);

        if (!browserWasOpened) {
            openBrowser('localhost:' + server.address().port);
            browserWasOpened = true;
        }
    });
});

compiler.watch();
