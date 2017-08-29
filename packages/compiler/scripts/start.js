import path from "path";
import express from "express";
import vhost from "vhost";
import requireUncached from "require-uncached";
import openBrowser from 'react-dev-utils/openBrowser';
import createWebpackCompiler from "./webpack/compiler";

let servers = [];
let browserWasOpened = false;

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
    // Convert the ENV "HOST" to an array of host:port
    // in order to use it for VHOST.
    const HOST = process.env.HOST || "localhost:3000";
    const hosts = HOST.split(",");
    let ports = [];
    const finalHosts = hosts.map(host => {
        ports.push(host.split(":")[1] || 80);
        return host.split(":")[0] || "";
    });

    if (servers.length > 0) {
        servers.forEach(server => server.close());
    }

    const app = express();

    finalHosts.forEach(host => {
        const inlineApp = express();

        // Serve static assets (js/css/img/fonts)
        inlineApp.use(express.static("./dist/client"));

        // Do the actual Server side render (OR just server a plain HTML if you prefer)
        // But you need to map to the assets map
        inlineApp.get("*", (req, res) => {
            /**
             * Server Side Rendering
             */
            res.send(
                requireUncached( path.join(path.resolve("./"), "dist", "server", "index") ).default({
                    url: req.path,
                    assets: assetsMap,
                })
            );

            /**
             * Standard Client only Rendering
             */
            // res.send(`
            // <html>
            //   <head>
            //     <link type="text/css" href="${assetsMap["main.css"]}" rel="stylesheet" media="all" />
            //   </head>
            //   <body>
            //     <div id="root"></div>
            //     <script src="${assetsMap["vendor.js"]}"></script>
            //     <script src="${assetsMap["main.js"]}"></script>
            //   </body>
            // </html>
            // `);
        });

        app.use(vhost(host, inlineApp));
    });

    ports.forEach(port => {
        const server = app.listen(port, function() {
            console.log("Listening on port %d", server.address().port);

            if (!browserWasOpened) {
                openBrowser('localhost:' + server.address().port);
                browserWasOpened = true;
            }
        });
        servers.push(server);
    });
});

compiler.watch();
