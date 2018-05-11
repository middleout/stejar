import { Route } from "../src/Route";

describe("Route", () => {
    describe("localizations", () => {
        test("Localized routes", () => {
            const routeMap = {
                en: {
                    fooRoute: "en-route",
                },
                fr: {
                    fooRoute: "fr-route",
                },
            };

            function getRoute(name, locale) {
                if (!routeMap[locale]) {
                    return null;
                }

                return routeMap[locale][name];
            }

            const route = Route({
                id: 1,
                name: "locale",
                path: "/:locale",
                routes: [
                    {
                        id: 2,
                        name: "foo",
                        path: ({ locale }) => getRoute("fooRoute", locale),
                    },
                ],
            });

            let match = route.match("/en/en-route");
            expect(match.name).toEqual("locale.foo");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);

            match = route.match("/fr/fr-route");
            expect(match.name).toEqual("locale.foo");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(2);

            match = route.match("/x/x-baz");
            expect(match).toEqual(false);
        });

        test("Localized not found", () => {
            const routeMap = {
                foo: {
                    bazRoute: "foo-baz",
                },
                bar: {
                    bazRoute: "bar-baz",
                },
            };

            function getRoute(name, locale) {
                if (!routeMap[locale]) {
                    return null;
                }

                return routeMap[locale][name];
            }

            const route = Route({
                id: 1,
                name: "locale",
                path: "/:locale",
                routes: [
                    {
                        id: 2,
                        name: "foo",
                        path: ({ locale }) => getRoute("bazRoute", locale),
                    },
                    {
                        id: 3,
                        name: "not-found",
                        path: "*",
                    },
                ],
            });

            const match = route.match("/x/x-baz");
            expect(match.name).toEqual("locale.not-found");
            expect(match.routes[0].id).toEqual(1);
            expect(match.routes[1].id).toEqual(3);
        });
    });
});
