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

    test("can work with componentS instead of component", done => {
        const router = ServerRouter({
            url: "/foo/baz",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                    component: ({ baz1, baz2, children }) => {
                        if (children) {
                            throw new Error("Children passed!");
                        }

                        return (
                            <div>
                                Foo {baz1} {baz2}
                            </div>
                        );
                    },
                    routes: [
                        {
                            name: "baz",
                            path: "baz",
                            components: {
                                baz1: () => <div>Baz 1</div>,
                                baz2: () => <div>Baz 2</div>,
                            },
                        },
                    ],
                },
            ],
        });

        router.start().then(result => {
            const comp = render(<RouterProvider router={router} match={result.match} />);
            expect(comp.text()).toEqual("Foo Baz 1 Baz 2");

            done();
        });
    });
});
