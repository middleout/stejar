import React from "react";
import Enzyme, { render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ServerRouter } from "@stejar/router-server";
import { RouterProvider } from "../src";

Enzyme.configure({ adapter: new Adapter() });

describe("RouterProvider", () => {
    test("mounts the component", done => {
        const router = ServerRouter({
            url: "/foo",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                    component: () => <div>Foo</div>,
                },
            ],
        });

        router.start().then(result => {
            const comp = render(<RouterProvider router={router} match={result.match} />);
            expect(comp.text()).toEqual("Foo");

            done();
        });
    });

    test("mounts the component", done => {
        const router = ServerRouter({
            url: "/foo",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                    component: () => <div>Foo</div>,
                },
            ],
        });

        router.start().then(result => {
            const comp = render(<RouterProvider router={router} match={result.match} />);
            expect(comp.text()).toEqual("Foo");

            done();
        });
    });
});
