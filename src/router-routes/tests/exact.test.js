import { Route } from "../src/Route";

describe("Route", () => {
    describe("exact", () => {
        test("Route can match exact only", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
                exact: true,
            });

            const match = route.match("/foo");
            expect(match.name).toEqual("foo");
        });

        test("Route can match exact only when having sub children", () => {
            const route = Route({
                name: "foo",
                path: "/foo",
                exact: true,
                routes: [
                    {
                        name: "bar",
                        path: "bar",
                    },
                ],
            });

            const match = route.match("/foo/bar");
            expect(match.name).toEqual("foo.bar");
        });

        test("Route can match exact only when being a children (basic test)", () => {
            const route = Route({
                id: 1,
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        id: 2,
                        exact: true,
                    },
                ],
            });

            const match = route.match("/foo");
            expect(match.name).toEqual("foo");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);
        });

        test("Route can match exact only when being a children (basic test) while having other brothers", () => {
            const route = Route({
                id: 1,
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        id: 2,
                        exact: true,
                    },
                    {
                        id: 3,
                        name: "bar",
                        path: "bar",
                    },
                ],
            });

            let match = route.match("/foo");
            expect(match.name).toEqual("foo");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);
        });

        test("Route does NOT match exact if needed", () => {
            const route = Route({
                id: 1,
                name: "foo",
                path: "/foo",
                routes: [
                    {
                        id: 2,
                        exact: true,
                    },
                    {
                        id: 3,
                        name: "bar",
                        path: "bar",
                    },
                ],
            });

            const match = route.match("/foo/bar");
            expect(match.name).toEqual("foo.bar");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(3);
        });
    });
});
