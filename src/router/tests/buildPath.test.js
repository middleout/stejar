import { createMemoryHistory } from "history";
import { Router } from "../src/Router";

describe("Router", () => {
    describe("build path", () => {
        test("to route", () => {
            const history = createMemoryHistory({
                initialEntries: ["/foo"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                ],
            });

            const url = router.buildPath("foo");
            expect(url).toEqual("/foo");
        });

        test("deep path", () => {
            const history = createMemoryHistory({
                initialEntries: ["/foo"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                        routes: [
                            {
                                name: "bar",
                                path: "bar",
                            },
                        ],
                    },
                ],
            });

            const url = router.buildPath("foo.bar");
            expect(url).toEqual("/foo/bar");
        });

        test("deep path with unnamed inbetween child", () => {
            const history = createMemoryHistory({
                initialEntries: ["/foo"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                        routes: [
                            {
                                routes: [
                                    {
                                        name: "bar",
                                        path: "bar",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            const url = router.buildPath("foo.bar");
            expect(url).toEqual("/foo/bar");
        });

        test("deep path with unnamed parent", () => {
            const history = createMemoryHistory({
                initialEntries: ["/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        routes: [
                            {
                                routes: [
                                    {
                                        name: "bar",
                                        path: "/bar",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            const url = router.buildPath("bar");
            expect(url).toEqual("/bar");
        });

        test("to non existing first route", () => {
            const history = createMemoryHistory({
                initialEntries: ["/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                    {
                        name: "bar",
                        path: "/bar",
                    },
                ],
            });

            const url = router.buildPath("bar");
            expect(url).toEqual("/bar");
        });

        test("with query", () => {
            const history = createMemoryHistory({
                initialEntries: ["/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                    {
                        name: "bar",
                        path: "/bar",
                    },
                ],
            });

            const url = router.buildPath("bar", {}, { x: "y" });
            expect(url).toEqual("/bar?x=y");
        });

        test("with params", () => {
            const history = createMemoryHistory({
                initialEntries: ["/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/:foo",
                    },
                    {
                        name: "bar",
                        path: "/bar",
                    },
                ],
            });

            const url = router.buildPath("foo", { foo: "baz" });
            expect(url).toEqual("/baz");
        });

        test("wrong path", () => {
            const history = createMemoryHistory({
                initialEntries: ["/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/foo",
                    },
                ],
            });

            expect(() => router.buildPath("bar")).toThrow();
        });

        test("build path using existing params and query", done => {
            const history = createMemoryHistory({
                initialEntries: ["/baz?x=asd"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/:foo",
                    },
                ],
            });

            router.start(match => {
                expect(match.query.x).toEqual("asd");
                const url = router.buildPath("foo", null, null, { reuseQuery: true });
                expect(url).toEqual("/baz?x=asd");
                done();
            });
        });

        test("build path to current route using existing params and query", done => {
            const history = createMemoryHistory({
                initialEntries: ["/baz"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo",
                        path: "/:foo",
                    },
                ],
            });

            router.start(() => {
                const url = router.buildPath();
                expect(url).toEqual("/baz");
                done();
            });
        });

        test("build path to a route with dots but not nested", done => {
            const history = createMemoryHistory({
                initialEntries: ["/foo/bar"],
            });

            const router = Router({
                history,
                routes: [
                    {
                        name: "foo.bar",
                        path: "/foo/bar",
                    },
                ],
            });

            router.start(() => {
                const url = router.buildPath("foo.bar");
                expect(url).toEqual("/foo/bar");
                done();
            });
        });
    });
});
