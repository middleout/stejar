import React from "react";
import Enzyme, { render, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createMemoryHistory } from "history";
import { Router } from "@stejar/router";
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

    test("can construct without onRouteMatch", done => {
        const history = createMemoryHistory({
            initialEntries: ["/foo"],
        });
        const router = Router({
            history,
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                    component: () => <div>Foo</div>,
                },
            ],
        });

        const comp = shallow(<RouterProvider router={router} />);
        setTimeout(() => {
            comp.update();
            expect(comp.text()).toEqual("<component />");
            done();
        }, 100);
    });
});
