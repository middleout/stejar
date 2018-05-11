import { createMemoryHistory } from "history";
import { Events } from "../src/Events";
import { Router } from "../src/Router";

describe("Router", () => {
    test("test can match basic", done => {
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

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("base");
            expect(match.routes[0].name).toEqual("base");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("test can build with single route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/"],
        });

        const router = Router({
            history,
            routes: {
                name: "base",
                path: "/",
            },
        });

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("base");
            expect(match.routes[0].name).toEqual("base");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("test can build with child route", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo"],
        });

        const router = Router({
            history,
            routes: {
                name: "base",
                path: "/",
                routes: [
                    {
                        name: "foo",
                        path: "foo",
                    },
                ],
            },
        });

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("base.foo");
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].name).toEqual("foo");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("test can build with unnamed in between", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo"],
        });

        const router = Router({
            history,
            routes: {
                name: "base",
                path: "/",
                routes: [
                    {
                        id: "unnamed",
                        routes: [
                            {
                                name: "foo",
                                path: "foo",
                            },
                        ],
                    },
                ],
            },
        });

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("base.foo");
            expect(match.routes[0].name).toEqual("base");
            expect(match.routes[1].id).toEqual("unnamed");
            expect(match.routes[2].name).toEqual("foo");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("test can build with unnamed as parent", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo"],
        });

        const router = Router({
            history,
            routes: {
                id: "unnamed",
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
            },
        });

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("base.foo");
            expect(match.routes[0].id).toEqual("unnamed");
            expect(match.routes[1].name).toEqual("base");
            expect(match.routes[2].name).toEqual("foo");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("ensure not ending with /", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo/"],
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

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("foo");
            expect(match.routes[0].name).toEqual("foo");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("ensure it doesnt work with invalid paths", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo//bar"],
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

        const unsub = router.subscribe(Events.MATCHED, () => {
            unsub();
            done.fail("Matched");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done();
        });

        router.start();
    });

    test("ensure it triggers not found", done => {
        const history = createMemoryHistory({
            initialEntries: ["/baz"],
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

        const unsub = router.subscribe(Events.MATCHED, () => {
            unsub();
            done.fail("Matched");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done();
        });

        router.start();
    });

    test("can match children", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo/bar"],
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

        const unsub = router.subscribe(Events.MATCHED, match => {
            unsub();
            expect(match.name).toEqual("foo.bar");
            expect(match.routes[0].name).toEqual("foo");
            expect(match.routes[1].name).toEqual("bar");
            done();
        });

        const notFOundUnsub = router.subscribe(Events.NOT_FOUND, () => {
            notFOundUnsub();
            done.fail("NOT FOUND");
        });

        router.start();
    });

    test("can subscribe only once", done => {
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

        router.once(Events.MATCHED, match => {
            expect(match.name).toEqual("foo");
            expect(match.routes[0].name).toEqual("foo");
            done();
        });

        router.once(Events.NOT_FOUND, () => done.fail("NOT FOUND"));

        router.start();
    });

    test("can unsubscribe only once", done => {
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

        const unsub = router.once(Events.MATCHED, () => done.fail());
        unsub();

        router.subscribe(Events.MATCHED, () => done());

        router.start();
    });

    test("cannot call start more than once once", done => {
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

        let counter = 0;
        router.once(Events.MATCHED, () => {
            counter++;

            if (counter > 1) {
                return done.fail();
            }
            done();
        });

        router.subscribe(Events.MATCHED, () => done());

        router.start();
        router.start();
    });

    test("can stop the router", done => {
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

        router.once(Events.MATCHED, () => {
            done();
        });

        router.subscribe(Events.MATCHED, () => done());
        const unsub = router.start();
        unsub();
    });

    test("can have an initial callback", done => {
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

        router.start(match => {
            expect(match.name).toEqual("foo");
            done();
        });
    });
});
