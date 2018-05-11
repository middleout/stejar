import { Route } from "../src/Route";

describe("Route", () => {
    describe("reverse", () => {
        test("Route can reverse", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
            });

            const url = route.reverse("foo");

            expect(url).toEqual("/foo");
        });

        test("Route should not reverse if not matching name", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
            });

            const url = route.reverse("baz");

            expect(url).toEqual(false);
        });

        test("should not reverse for an invalid name", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
            });

            expect(() => route.reverse("foo.")).toThrow();
        });

        test("should not reverse for no generated path", () => {
            const route = Route({
                name: "foo",
                path: () => null,
            });

            const url = route.reverse("foo");
            expect(url).toEqual(false);
        });

        test("should not reverse for no generated path of a child", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        name: "bar",
                        path: () => null,
                    },
                ],
            });

            const url = route.reverse("foo.bar");
            expect(url).toEqual(false);
        });

        test("Route can reverse with children", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        name: "bar",
                        path: "bar",
                    },
                ],
            });

            const fooUrl = route.reverse("foo");
            expect(fooUrl).toEqual("/foo");

            const barUrl = route.reverse("foo.bar");
            expect(barUrl).toEqual("/foo/bar");
        });

        test("Route can reverse with path as a fn()", () => {
            const route = Route({
                name: "foo",
                path: () => "/foo",
            });

            const url = route.reverse("foo");
            expect(url).toEqual("/foo");
        });

        test("Route can reverse with path as a fn() which receives the params and query", () => {
            const route = Route({
                name: "foo",
                path: (params, query) => `/foo/${params.x}/${query.a}`,
            });

            const url = route.reverse("foo", { x: "y" }, { a: "b" });
            expect(url).toEqual("/foo/y/b");
        });

        test("Route can reverse root route unnamed", () => {
            const route = Route({
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                ],
            });

            const url = route.reverse("foo");
            expect(url).toEqual("/foo");
        });

        test("Route can reverse with child route in between routes unnamed", () => {
            const route = Route({
                name: "base",
                path: "/",
                routes: [
                    {
                        routes: [
                            {
                                name: "foo",
                                path: "foo",
                            },
                        ],
                    },
                ],
            });

            const url = route.reverse("base.foo");
            expect(url).toEqual("/foo");
        });

        test("Route can reverse with supplied params", () => {
            const route = Route({
                name: "base",
                path: "/:locale",
                routes: [
                    {
                        routes: [
                            {
                                name: "foo",
                                path: "foo",
                            },
                        ],
                    },
                ],
            });

            const url = route.reverse("base.foo", { locale: "en-GB" });
            expect(url).toEqual("/en-GB/foo");
        });

        test("Route cannot reverse with invalid supplied params", () => {
            const route = Route({
                name: "base",
                path: "/:locale",
            });

            expect(() => route.reverse("base", { language: "en-GB" })).toThrowError(
                "no values provided for key `locale`"
            );
        });

        test("Route cannot reverse with invalid supplied params by constraint", () => {
            const route = Route({
                name: "base",
                path: "/:locale",
                constraints: {
                    locale: "ro",
                },
            });

            expect(route.reverse("base", { locale: "fr" })).toEqual(false);
        });
    });
});
