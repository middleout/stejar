import express from "express";
import { createRequestHandler } from "./createRequestHandler";

export function createServer({
    host,
    port,
    routes,
    beforeRender,
    onRender = () => null,
    staticPath = "./dist/client",
    htmlTemplate,
    pathToAssetsMap,
}) {
    const handler = createRequestHandler({ routes, htmlTemplate, pathToAssetsMap, onRender, beforeRender });

    const app = express();
    app.use(express.static(staticPath));
    app.get("*", handler);
    return () => {
        app.listen(port, host, err => {
            if (err) {
                console.error(err);
                return false;
            }

            console.info("==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port);
        });
    };
}
