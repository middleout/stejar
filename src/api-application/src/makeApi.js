import { serial } from "items-promise";
import bodyParser from "body-parser";
import { EventEmitter } from "fbemitter";
import { setupDebugger } from "@stejar/debugger";
import { clearTerminal } from "@stejar/clear-terminal";
import express from "express";
import helmet from "helmet";
import { createResponseError } from "./responses";
// import { start as enablePrettyErrors } from "pretty-error";

export function makeApi() {
    // enablePrettyErrors();
    setupDebugger();

    let _shouldClearTerminal = true;
    const _plugins = [app => app.use(helmet()), app => app.use(bodyParser.json())];
    const _preMiddlewares = [];
    const _postMiddlewares = [];
    const _routes = [];
    const _factories = [];
    let _notFound = (req, res) => {
        const { statusCode, payload } = createResponseError("generic", "pageNotFound", 404);

        return res.status(statusCode).send(JSON.stringify(payload));
    };

    let _error = (err, req, res) => {
        console.error("Some error");
        console.error(err);
        console.error(JSON.stringify(err));

        const { statusCode, payload } = createResponseError("generic", "internalServerError", 500);

        res.status(statusCode).send(JSON.stringify(payload));
    };
    const makeContainer = () => _factories.reduce((p, c) => c(p), {});

    return Object.create({
        enableRefreshConsoleOnRequest() {
            _shouldClearTerminal = true;
            return this;
        },
        disableRefreshConsoleOnRequest() {
            _shouldClearTerminal = false;
            return this;
        },
        plugin(...plugins) {
            plugins.map(p => _plugins.push(p));
            return this;
        },
        preRequestMiddleware(...middlewares) {
            middlewares.map(m => _preMiddlewares.push(m));
            return this;
        },
        postRequestMiddleware(...middlewares) {
            middlewares.map(m => _postMiddlewares.push(m));
            return this;
        },
        route(...routes) {
            routes.map(r => {
                if (Array.isArray(r)) {
                    this.routes(...r);
                } else {
                    _routes.push(r);
                }
            });
            return this;
        },
        factory(...factories) {
            factories.map(f => _factories.push(f));
            return this;
        },
        onNotFound(cb) {
            _notFound = (req, res) => cb(req, res);
            return this;
        },
        onError(cb) {
            _error = (err, req, res) => cb(err, req, res);
            return this;
        },
        start({ host, port }) {
            /**
             *************************
             * The main final middleware which gets called once the app has finished
             *************************
             */
            _postMiddlewares.push(({ res, statusCode, payload }) =>
                Promise.resolve(
                    res
                        .status(statusCode)
                        .header("Content-Type", "application/json")
                        .send(JSON.stringify(payload))
                )
            );

            const eventEmitter = new EventEmitter();

            /**
             *************************
             * Create the express app
             *************************
             */
            const app = express();

            /**
             *************************
             * Boot plugins
             *************************
             */
            _plugins.map(p => p(app));

            /**
             *************************
             * Setup the DI container and EventEmitter + clear terminal
             *************************
             */
            app.use((req, res, next) => {
                if (_shouldClearTerminal) {
                    clearTerminal();
                }
                req.$container = makeContainer();
                req.$eventEmitter = eventEmitter;
                eventEmitter.once("POST_REQUEST", data => serial(_postMiddlewares, item => item(data)));
                return next();
            });

            /**
             *************************
             * Boot middlewares
             *************************
             */
            _preMiddlewares.map(m => app.use(m));

            /**
             *************************
             * Boot makeRoute middlewares
             *************************
             */
            _routes.map(route => route(app));

            /**
             *************************
             * Handle errors / not found
             *************************
             */
            app.all("*", _notFound);
            app.use(_error);

            /**
             *************************
             * START EXPRESS
             *************************
             */
            app.listen(port, host, err => {
                if (err) {
                    console.error(err);
                    return false;
                }

                console.info("==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port);
            });
        },
    });
}
