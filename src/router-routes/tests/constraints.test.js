import { Route } from "../src/Route";

describe("Route", () => {
    describe("constraints", () => {
        test("basic constraint", () => {
            const route = Route({
                name: "base",
                path: "/:locale",
                constraints: {
                    locale: "ro|en",
                },
            });
            expect(route.match("/ro").name).toEqual("base");
            expect(route.match("/fr")).toEqual(false);
        });

        test("constraints for a child route", () => {
            const route = Route({
                name: "base",
                path: "/",
                routes: [
                    {
                        name: "locale",
                        path: ":locale",
                        constraints: {
                            locale: "ro|en",
                        },
                    },
                ],
            });
            expect(route.match("/ro").name).toEqual("base.locale");
            expect(route.match("/fr")).toEqual(false);
        });
    });
});
