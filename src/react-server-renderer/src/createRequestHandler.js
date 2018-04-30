import path from "path";
import { ServerRouter } from "@stejar/router-server";
import { RouterProvider } from "@stejar/router-react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { createAssetsMap } from "./createAssetsMap";
import { createHtml as defaultCreateHtmlTemplate } from "./createHtml";

export function createRequestHandler({
    routes,
    onRender,
    beforeRender,
    createHtml = defaultCreateHtmlTemplate,
    pathToAssetsMap = path.resolve(path.join("dist", "webpack-assets.json")),
}) {
    return (req, res) => {
        const { scripts, styles } = createAssetsMap(pathToAssetsMap);
        const router = new ServerRouter({ url: req.originalUrl, routes });

        router
            .start()
            .then(({ code, isRedirect, url, match }) => {
                if (isRedirect) {
                    return res.redirect(code, url);
                }

                beforeRender().then(() => {
                    const state = {};
                    const routerProvider = createElement(RouterProvider, {
                        router,
                        match: match,
                    });

                    const appHtml = renderToString(routerProvider);
                    const helmet = Helmet.renderStatic();
                    const html = createHtml(helmet, scripts, styles, appHtml, state);

                    onRender();
                    return res.status(code).send(html);
                });
            })
            .catch(error => {
                console.error("ERROR IN RENDERING");
                console.error(error);

                if (error.notFound) {
                    return res.status(error.code).send("Page not foud");
                }

                return res.status(500).send("Internal Server Error");
            });
    };
}
