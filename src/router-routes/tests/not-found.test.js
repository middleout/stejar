import { Route } from "../src/Route";

describe("Route", () => {
    describe("not-found", () => {
        test("can match not found", () => {
            const route = Route({
                name: "not-found",
                path: "*",
            });

            expect(route.match("/some-path").name).toEqual("not-found");
        });

        test("can match not found with an unamed parent", () => {
            const route = Route({
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                    {
                        name: "not-found",
                        path: "*",
                    },
                ],
            });

            expect(route.match("/bar").name).toEqual("not-found");
        });

        test("can match not found as a child", () => {
            const route = Route({
                name: "base",
                path: "/",
                routes: [
                    {
                        name: "foo",
                        path: "foo",
                    },
                    {
                        name: "not-found",
                        path: "*",
                    },
                ],
            });

            expect(route.match("/bar").name).toEqual("base.not-found");
        });

        test("can match not found with params matching from parent", () => {
            const route = Route({
                name: "base",
                path: "/:locale",
                routes: [
                    {
                        name: "foo",
                        path: "foo",
                    },
                    {
                        name: "not-found",
                        path: "*",
                    },
                ],
            });

            expect(route.match("/ro/foo").name).toEqual("base.foo");
            expect(route.match("/ro/bar").name).toEqual("base.not-found");
            expect(route.match("/ro/bar").params).toEqual({ locale: "ro" });
        });

        test("can match not found as a child when not matching params", () => {
            const route = Route({
                name: "base",
                path: "/",
                routes: [
                    {
                        name: "foo",
                        path: ":fooParam",
                        constraints: {
                            fooParam: "foo",
                        },
                    },
                    {
                        name: "not-found",
                        path: "*",
                    },
                ],
            });

            expect(route.match("/foo").name).toEqual("base.foo");
            expect(route.match("/bar").name).toEqual("base.not-found");
        });

        test("cannot be created without path but with a name", () => {
            expect(() => Route({ name: "base" })).toThrow();
        });

        test("can be created without name and path", () => {
            const route = Route({});
            expect(route).toEqual(expect.any(Object));
        });
    });
});
