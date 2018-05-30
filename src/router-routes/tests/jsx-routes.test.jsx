import { Route } from "../src/Route";
import React from "React";
import { Route as ReactRoute } from "@stejar/router-react";

describe("Route", () => {
    describe("jsx-routes", () => {
        test("cannot create with jsx routes", () => {
            const route = () => Route(<ReactRoute name="base" path="/" />);

            expect(route).toThrow(
                "A route cannot be created using a React spec. Did you forget to use convertRoutes() ?"
            );
        });
    });
});
