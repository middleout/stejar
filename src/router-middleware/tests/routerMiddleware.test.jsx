import { routerMiddlewareRunnerFactory, routerMiddleware } from "./../src/routerMiddleware";

describe("routerMiddleware", () => {
    test("That it works normally", done => {
        const onRouteMatch = routerMiddleware();

        const match = {
            routes: [
                {
                    middleware: async () => 1,
                },
                {
                    middleware: async () => 2,
                },
            ],
        };

        onRouteMatch(match).then(result => {
            expect(result).toEqual(2);
            done();
        });
    });

    test("That it works even if no middleware is present on a route", done => {
        const onRouteMatch = routerMiddleware();

        const match = {
            routes: [
                {
                    middleware: async () => 1,
                },
                {
                    middleware: async () => 2,
                },
                {},
            ],
        };

        onRouteMatch(match).then(result => {
            expect(result).toEqual(2);
            done();
        });
    });

    test("That it passes the match and options to each middlewarae", done => {
        const opts = {
            foo: "bar",
        };

        const onRouteMatch = routerMiddleware(opts);

        const match = {
            someData: "some data",
            routes: [
                {
                    middleware: async (routeMatch, options) => {
                        expect(routeMatch.someData).toEqual("some data");
                        expect(options).toEqual(opts);
                    },
                },
                {
                    middleware: async () => null,
                },
                {},
            ],
        };

        onRouteMatch(match).then(() => done());
    });

    test("That it can use a differnet fetchMethod", done => {
        const opts = {
            foo: "bar",
        };

        const onRouteMatch = routerMiddlewareRunnerFactory(item => item.baz, opts);

        const match = {
            someData: "some data",
            routes: [
                {
                    baz: async (routeMatch, options) => {
                        expect(routeMatch.someData).toEqual("some data");
                        expect(options).toEqual(opts);
                    },
                },
                {
                    baz: async () => null,
                },
                {},
            ],
        };

        onRouteMatch(match).then(() => done());
    });
});
