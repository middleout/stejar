import * as React from 'react';
import {shallow} from 'enzyme';
import {Component} from "./../../src/React/Component";

describe("Component", () => {

    it('can bind methods correctly', () => {

        class Application extends Component<any,any> {

            protected someValue = "after";

            state = {
                value: "before",
            }

            render() {
                return <div onClick={this.handleOnClick} className="Application">{this.state.value}</div>
            }

            handleOnClick() {
                this.setState({
                    value: this.someValue
                })
            }
        }

        const component = shallow(<Application />);
        expect(component.find('.Application').text()).toEqual('before');
        component.find('.Application').simulate('click');
        expect(component.find('.Application').text()).toEqual('after');
    });

});
