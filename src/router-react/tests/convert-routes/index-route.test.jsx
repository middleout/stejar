import React from "react";
import { Route } from "../../src/Route";
import { IndexRoute } from "../../src/IndexRoute";
import { convertRoutes } from "../../src/convertRoutes";

describe("convert-routes", () => {
    describe("index-route", () => {
        test("can create an index route", () => {
            const routes = convertRoutes(
                <Route name="base" path="base">
                    <IndexRoute foo="bar" />
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
                        },
                    ],
                },
            ]);
        });

        test("cannot create an index route with name", () => {
            expect(() => convertRoutes(<IndexRoute name="foo" />)).toThrow();
        });

        test("cannot create an index route with path", () => {
            expect(() => convertRoutes(<IndexRoute path="foo" />)).toThrow();
        });

        test("cannot create an index route as a root route", () => {
            expect(() => convertRoutes(<IndexRoute />)).toThrow();
        });

        test("cannot create an index route as child of an unnamed route", () => {
            expect(() =>
                convertRoutes(
                    <Route path="foo">
                        <IndexRoute />
                    </Route>
                )
            ).toThrow();
        });

        test("cannot create an index route as child of a pathless route", () => {
            expect(() =>
                convertRoutes(
                    <Route name="foo">
                        <IndexRoute />
                    </Route>
                )
            ).toThrow();
        });

        test("cannot create an index route as child of a pathless unnamed route", () => {
            expect(() =>
                convertRoutes(
                    <Route>
                        <IndexRoute />
                    </Route>
                )
            ).toThrow();
        });
    });
});
