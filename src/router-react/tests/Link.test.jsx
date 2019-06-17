import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Events } from "@stejar/router";
import { ServerRouter } from "@stejar/router-server";
import { LinkComponent } from "../src/Link";

Enzyme.configure({ adapter: new Adapter() });

describe("Link", () => {
    test("Can render Link and click it", done => {
        const router = ServerRouter({
            url: "/foo",
            routes: [
                {
                    name: "foo",
                    path: "/foo",
                    component: () => <div>Foo</div>,
                },
                {
                    name: "bar",
                    path: "/bar",
                    component: () => <div>Foo</div>,
                },
            ],
        });

        let counter = 0;
        router.start().then(() => {
            const comp = shallow(
                <LinkComponent
                    onClick={() => counter++}
                    router={router}
                    to="bar"
                    className="hello"
                    render={props => <a {...props} />}>
                    Hello
                </LinkComponent>
            );
            expect(counter).toBe(0);
            expect(comp.html()).toEqual(`<a class="hello" href="/bar">Hello</a>`);

            router.once(Events.MATCHED, match => {
                expect(counter).toBe(1);
                expect(match.name).toEqual("bar");
                done();
            });

            comp.find("a").simulate("click", {preventDefault: () => null});
        });
    });

    test("Can reuse params and query on Link", done => {
        const router = ServerRouter({
            url: "/foo?x=y",
            routes: [
                {
                    name: "bar",
                    path: "/bar:foo",
                    component: () => <div>Foo</div>,
                },
                {
                    name: "foo",
                    path: "/:foo",
                    component: () => <div>Foo</div>,
                },
            ],
        });

        router.start().then(() => {
            const comp = shallow(
                <LinkComponent
                    reuseParams
                    reuseQuery
                    router={router}
                    to="bar"
                    className="hello"
                    render={props => <a {...props} />}>
                    Hello
                </LinkComponent>
            );
            expect(comp.html()).toEqual(`<a class="hello" href="/barfoo?x=y">Hello</a>`);

            router.once(Events.MATCHED, match => {
                expect(match.name).toEqual("bar");
                expect(match.params).toEqual({
                    foo: "foo",
                });
                expect(match.query).toEqual({
                    x: "y",
                });
                done();
            });

            comp.find("a").simulate("click", {preventDefault: () => null});
        });
    });
});
