import { ServerRouter } from "../src";

describe("ServerRouter", () => {
    test("it can redirect", done => {
        const router = new ServerRouter({
            url: "/",
            routes: [
                {
                    name: "base",
                    path: "/",
                    redirect: {
                        to: "base.foo",
                        options: {
                            statusCode: 302,
                        },
                    },
                    routes: [
                        {
                            name: "foo",
                            path: "foo",
                        },
                    ],
                },
            ],
        });

        router.start().then(result => {
            expect(result.redirect).toBe("/foo");
            expect(result.notFound).toBe(false);
            expect(result.statusCode).toBe(302);
            done();
        });
    });

    test("it can redirect with 301 default code", done => {
        const router = new ServerRouter({
            url: "/",
            routes: [
                {
                    name: "base",
                    path: "/",
                    redirect: {
                        to: "base.foo",
                    },
                    routes: [
                        {
                            name: "foo",
                            path: "foo",
                        },
                    ],
                },
            ],
        });

        router.start().then(result => {
            expect(result.redirect).toBe("/foo");
            expect(result.notFound).toBe(false);
            expect(result.statusCode).toBe(301);
            done();
        });
    });

    test("not found", done => {
        const router = new ServerRouter({
            url: "/baz",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                },
            ],
        });

        router.start().then(result => {
            expect(result.redirect).toBe(false);
            expect(result.notFound).toBe(true);
            expect(result.statusCode).toBe(404);
            expect(result.error).toEqual({
                path: "/baz",
                query: {},
            });
            done();
        });
    });

    test("match", done => {
        const router = new ServerRouter({
            url: "/foo",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                },
            ],
        });

        router.start().then(result => {
            expect(result.redirect).toBe(false);
            expect(result.notFound).toBe(false);
            expect(result.statusCode).toBe(200);
            expect(result.match.name).toEqual("foo");
            done();
        });
    });
});
