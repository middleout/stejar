import { render } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
import { DangerousHtml } from "../src/DangerousHtml";

test("Should be able to use it", () => {
    const component = renderer.create(<DangerousHtml>Hello World</DangerousHtml>);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const dom = render(<DangerousHtml>Hello World</DangerousHtml>);
    expect(dom.text()).toEqual("Hello World");
});
