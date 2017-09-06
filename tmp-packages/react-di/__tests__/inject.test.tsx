import React, { Component } from "react";
import { ServiceManager, injectable } from "@stejar/di";
import { render } from "enzyme";
import { ServiceProvider } from "../src/ServiceProvider";
import { inject } from "../src/inject";

test("Should be able to use it", () => {
    const sm = new ServiceManager();

    @injectable
    class Tester {}

    interface Props {
        Tester?: Tester;
    }

    @inject({
        Tester: Tester,
    })
    class App extends Component<Props> {
        render() {
            return (
                <div>
                    {this.props.Tester.constructor.name}
                </div>
            );
        }
    }

    const component = render(
        <ServiceProvider serviceManager={sm}>
            <App />
        </ServiceProvider>
    );

    expect(component.find('div').text()).toEqual("Tester");
});
