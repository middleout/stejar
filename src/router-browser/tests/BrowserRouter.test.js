import { BrowserRouter } from "../src";

describe("BrowserRouter", () => {
    test("it can construct", () => {
        const router = BrowserRouter({
            routes: [
                {
                    name: "base",
                    path: "/",
                },
            ],
        });

        expect(router).toBeTruthy();
    });
});
