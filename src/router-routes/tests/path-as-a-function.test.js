import { Route } from "../src/Route";

describe("Route", () => {
    describe("path as a function", () => {
        test("basic match", () => {
            const route = Route({ name: "base", path: () => "/foo" });
            const match = route.match("/foo");

            expect(match.name).toEqual("base");
        });

        test("of a child", () => {
            const route = Route({
                name: "base",
                path: "/",
                routes: [
                    {
                        name: "foo",
                        path: () => "foo",
                    },
                ],
            });
            const match = route.match("/foo");
            expect(match.name).toEqual("base.foo");
        });

        test("receives route params and query", () => {
            const route = Route({
                name: "base",
                path: "/:name",
                routes: [
                    {
                        name: "foo",
                        bar: "baz",
                        path: (params, query) => {
                            expect(params).toEqual({
                                name: "testName",
                            });
                            expect(query).toEqual({
                                queryParam: "queryValue",
                            });

                            return "foo";
                        },
                    },
                ],
            });
            const match = route.match("/testName/foo", { queryParam: "queryValue" });
            expect(match.name).toEqual("base.foo");
            expect(match.params).toEqual({
                name: "testName",
            });
            expect(match.query).toEqual({
                queryParam: "queryValue",
            });
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].name).toEqual("foo");
        });
    });
});
