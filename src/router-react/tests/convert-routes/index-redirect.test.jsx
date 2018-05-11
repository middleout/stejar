import React from "react";
import { Route } from "../../src/Route";
import { IndexRedirectRoute } from "../../src/IndexRedirectRoute";
import { convertRoutes } from "../../src/convertRoutes";

describe("convert-routes", () => {
    describe("index-redirect", () => {
        test("can create an index redirect route", () => {
            const routes = convertRoutes(
                <Route name="base" path="base">
                    <IndexRedirectRoute to="baz" foo="bar" />
                </Route>
            );
            expect(routes).toEqual([
                {
                    name: "base",
                    path: "base",
                    routes: [
                        {
                            exact: true,
                            foo: "bar",
                            redirect: {
                                to: "baz",
                                params: {},
                                query: {},
                                options: {},
                            },
                        },
                    ],
                },
            ]);
        });

        test("cannot create an index redirect route with name", () => {
            expect(() => convertRoutes(<IndexRedirectRoute name="foo" />)).toThrow();
        });

        test("cannot create an index redirect route with path", () => {
            expect(() => convertRoutes(<IndexRedirectRoute path="foo" />)).toThrow();
        });

        test("cannot create an index redirect route as a root route", () => {
            expect(() => convertRoutes(<IndexRedirectRoute />)).toThrow();
        });

        test("cannot create an index redirect route as child of an unnamed route", () => {
            expect(() =>
                convertRoutes(
                    <Route path="foo">
                        <IndexRedirectRoute />
                    </Route>
                )
            ).toThrow();
        });

        test("cannot create an index redirect route as child of a pathless route", () => {
            expect(() =>
                convertRoutes(
                    <Route name="foo">
                        <IndexRedirectRoute />
                    </Route>
                )
            ).toThrow();
        });

        test("cannot create an index redirect route as child of a pathless unnamed route", () => {
            expect(() =>
                convertRoutes(
                    <Route>
                        <IndexRedirectRoute />
                    </Route>
                )
            ).toThrow();
        });
    });
});
