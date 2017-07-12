import { shallow } from "enzyme";
import React from "react";
import { BindedComponent } from "../src/BindedComponent";

test("Should be able to use it", () => {
    class MyComponent extends BindedComponent<{ clickValue?: string }, { clicked: string }> {
        state = { clicked: "" };

        render(): JSX.Element {
            return <div onClick={this.handleClick}>My Component</div>;
        }

        handleClick() {
            this.setState({ clicked: this.props.clickValue });
        }
    }

    const component = shallow(<MyComponent clickValue="foo" />);
    expect(component.text()).toEqual("My Component");
    expect(component.state()).toEqual({clicked: ""});

    component.find('div').simulate('click');
    expect(component.state()).toEqual({clicked: "foo"});
});
