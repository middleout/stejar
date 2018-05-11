import { Route } from "../src/Route";

describe("Route", () => {
    describe("name and path", () => {
        test("cannot be created without a name but with a path", () => {
            expect(() => Route({ path: "/" })).toThrow();
        });

        test("cannot be created without path but with a name", () => {
            expect(() => Route({ name: "base" })).toThrow();
        });

        test("can be created without name and path", () => {
            const route = Route({});
            expect(route).toEqual(expect.any(Object));
        });
    });
});
