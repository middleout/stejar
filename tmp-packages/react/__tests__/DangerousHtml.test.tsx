import { render } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
import { DangerousHtml } from "../src/DangerousHtml";

test("Should be able to use it", () => {
    const component = renderer.create(<DangerousHtml>Hello World</DangerousHtml>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const dom = render(<DangerousHtml>Hello World</DangerousHtml>);
    expect(dom.find('span').text()).toEqual("Hello World");
    expect(dom.find('span').attr('class')).toEqual("dangerousHtml");
});

test("Should be able to use it by giving it a class", () => {
    const component = renderer.create(<DangerousHtml className="foo">Hello World</DangerousHtml>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const dom = render(<DangerousHtml className="foo">Hello World</DangerousHtml>);
    expect(dom.find('span').text()).toEqual("Hello World");
    expect(dom.find('span').attr('class')).toEqual("foo dangerousHtml");
});

test("Should be able to use it by giving it a differnet element", () => {
    const component = renderer.create(<DangerousHtml element="div">Hello World</DangerousHtml>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const dom = render(<DangerousHtml element="div">Hello World</DangerousHtml>);
    expect(dom.find('div').text()).toEqual("Hello World");
});
