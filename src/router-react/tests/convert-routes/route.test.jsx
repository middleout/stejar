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
    });
});
