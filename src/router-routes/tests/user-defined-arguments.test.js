import { Route } from "../src/Route";

describe("Route", () => {
    describe("user defined arguments", () => {
        test("can be created with user defined arguments", () => {
            const route = Route({ someArg: "foo" });
            expect(route.someArg).toEqual("foo");
        });
    });
});
