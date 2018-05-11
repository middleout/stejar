import React from "react";
import { RedirectRoute } from "../../src/RedirectRoute";
import { convertRoutes } from "../../src/convertRoutes";

describe("convert-routes", () => {
    describe("redirect", () => {
        test("can create an redirect route", () => {
            const routes = convertRoutes(<RedirectRoute name="foo" path="foo" to="baz" foo="bar" />);
            expect(routes).toEqual([
                {
                    name: "foo",
                    path: "foo",
                    foo: "bar",
                    redirect: {
                        to: "baz",
                        params: {},
                        query: {},
                        options: {},
                    },
                },
            ]);
        });
    });
});
