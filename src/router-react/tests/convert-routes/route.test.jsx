import React from "react";
import { Route } from "../../src/Route";
import { convertRoutes } from "../../src/convertRoutes";

describe("convert-routes", () => {
    describe("route", () => {
        test("can create a route", () => {
            const routes = convertRoutes(<Route name="base" path="base" foo="bar" />);
            expect(routes).toEqual([
                {
                    name: "base",
                    path: "base",
                    foo: "bar",
                },
            ]);
        });

        test("can create a route with children", () => {
            const routes = convertRoutes(
                <Route name="base" path="base">
                    <Route name="foo" path="foo" />
                </Route>
            );
            expect(routes).toEqual([
                {
                    name: "base",
                    path: "base",
                    routes: [
                        {
                            name: "foo",
                            path: "foo",
                        },
                    ],
                },
            ]);
        });

        test("can create a route with children with unnamed in between", () => {
            const routes = convertRoutes(
                <Route name="base" path="base">
                    <Route>
                        <Route name="foo" path="foo" />
                    </Route>
                </Route>
            );
            expect(routes).toEqual([
                {
                    name: "base",
                    path: "base",
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
                },
            ]);
        });

        test("cannnot create a route with an invalid child", () => {
            const routes = () =>
                convertRoutes(
                    <Route name="base" path="base">
                        <Route>
                            <Route name="foo" path="foo" />
                            some invalid child
                        </Route>
                    </Route>
                );
            expect(routes).toThrow(
                "All routes passed to the convertRoutes() function must be React elements and be of type Route, IndexRoute, IndexRedirectRoute, or RedirectRoute. You have passed a different type of element. Please check your route config."
            );
        });
    });
});
