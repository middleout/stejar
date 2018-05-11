import { createMemoryHistory } from "history";
import { Events } from "../src/Events";
import { Router } from "../src/Router";

describe("Router", () => {
    test("can redirect", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                    routes: [
                        {
                            name: "foo",
                            path: "foo",
                        },
                    ],
                },
            ],
        });

        router.once(Events.MATCHED, match => {
            expect(match.name).toEqual("base");
        });

        router.start(() => {
            router.once(Events.MATCHED, match => {
                expect(match.name).toEqual("base.foo");
                done();
            });

            router.redirect("base.foo");
        });
    });

    test("can redirect with status code", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                    routes: [
                        {
                            name: "foo",
                            path: "foo",
                        },
                    ],
                },
            ],
        });

        router.start(() => {
            router.once(Events.MATCHED, match => {
                expect(match.name).toEqual("base.foo");
                expect(match.options.statusCode).toEqual(301);
                done();
            });

            router.redirect("base.foo", undefined, undefined, {
                statusCode: 301,
            });
        });
    });

    test("edirect to current route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                },
            ],
        });

        router.start(() => {
            router.once(Events.MATCHED, match => {
                expect(match.name).toEqual("base");
                done();
            });

            router.redirect();
        });
    });

    test("redirection route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                    redirect: {
                        to: "base.foo",
                        params: {
                            foo: "bar",
                        },
                        query: {
                            x: "y",
                        },
                        options: {
                            statusCode: 301,
                        },
                    },
                    routes: [
                        {
                            name: "foo",
                            path: ":foo",
                        },
                    ],
                },
            ],
        });

        router.start(match => {
            expect(match.name).toEqual("base.foo");
            expect(match.params).toEqual({
                foo: "bar",
            });
            expect(match.query).toEqual({
                x: "y",
            });
            expect(match.options).toEqual({
                statusCode: 301,
            });
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].name).toEqual("foo");
            done();
        });
    });

    test("index redirection route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                    routes: [
                        {
                            exact: true,
                            redirect: {
                                to: "base.foo",
                                params: {
                                    foo: "bar",
                                },
                                query: {
                                    x: "y",
                                },
                                options: {
                                    statusCode: 301,
                                },
                            },
                        },
                        {
                            name: "foo",
                            path: ":foo",
                        },
                    ],
                },
            ],
        });

        router.start(match => {
            expect(match.name).toEqual("base.foo");
            expect(match.params).toEqual({
                foo: "bar",
            });
            expect(match.query).toEqual({
                x: "y",
            });
            expect(match.options).toEqual({
                statusCode: 301,
            });
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].name).toEqual("foo");
            done();
        });
    });

    test("standard redirection route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/redirect"],
        });

        const router = Router({
            history,
            routes: [
                {
                    name: "base",
                    path: "/",
                    routes: [
                        {
                            name: "redirection",
                            path: "redirect",
                            redirect: {
                                to: "base.foo",
                                params: {
                                    foo: "bar",
                                },
                                query: {
                                    x: "y",
                                },
                                options: {
                                    statusCode: 301,
                                },
                            },
                        },
                        {
                            name: "foo",
                            path: ":foo",
                        },
                    ],
                },
            ],
        });

        router.start(match => {
            expect(match.name).toEqual("base.foo");
            expect(match.params).toEqual({
                foo: "bar",
            });
            expect(match.query).toEqual({
                x: "y",
            });
            expect(match.options).toEqual({
                statusCode: 301,
            });
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].name).toEqual("foo");
            done();
        });
    });
});
