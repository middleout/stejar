import { shallow } from "enzyme";
import React from "react";
import { PureBindedComponent } from "../src/PureBindedComponent";

test("Should be able to use it", () => {
    class MyComponent extends PureBindedComponent<{ clickValue?: string }, { clicked: string }> {
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
