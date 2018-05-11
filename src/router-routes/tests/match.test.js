import { Route } from "../src/Route";

describe("Route", () => {
    describe("match", () => {
        test("basic match", () => {
            const route = Route({ name: "base", path: "/" });
            const match = route.match("/");

            expect(match.name).toEqual("base");
        });

        test("match path must not always start with a slash", () => {
            const route = Route({ name: "foo", path: "foo" });
            const match = route.match("foo");

            expect(match.name).toEqual("foo");
        });

        test("matched params", () => {
            const route = Route({ name: "base", path: "/:foo" });
            const match = route.match("/baz");

            expect(match.name).toEqual("base");
            expect(match.params).toEqual({
                foo: "baz",
            });
            expect(match.query).toEqual({});
        });

        test("match query", () => {
            const route = Route({ name: "base", path: "/:foo" });
            const match = route.match("/baz", { x: "y" });

            expect(match.name).toEqual("base");
            expect(match.params).toEqual({
                foo: "baz",
            });
            expect(match.query).toEqual({
                x: "y",
            });
        });

        test("deep match", () => {
            let route = Route({
                name: "foo",
                path: "/foo/bar",
                routes: [
                    {
                        name: "baz",
                        path: "baz",
                        routes: [
                            {
                                name: "buzz",
                                path: "buzz",
                            },
                        ],
                    },
                ],
            });

            let match = route.match("/foo/bar/baz/buzz");
            expect(match.name).toEqual("foo.baz.buzz");
        });

        test("deep match - with unnamed parent", () => {
            const route = Route({
                id: 1,
                routes: [
                    {
                        id: 2,
                        name: "foo",
                        path: "/foo",
                    },
                ],
            });

            const match = route.match("/foo");
            expect(match.name).toEqual("foo");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);
        });

        test("deep match - with unnamed parent in between", () => {
            const route = Route({
                id: 1,
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        id: 2,
                        // unnamed here
                        routes: [
                            {
                                id: 3,
                                name: "bar",
                                path: "bar",
                            },
                        ],
                    },
                ],
            });

            const match = route.match("/foo/bar");
            expect(match.name).toEqual("foo.bar");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);
            expect(match.routes[2].id).toEqual(3);
        });

        test("do not match a partial path", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
            });

            const match = route.match("/foo/bar");
            expect(match).toEqual(false);
        });
    });
});
