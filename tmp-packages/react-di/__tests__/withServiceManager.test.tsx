import React, { Component } from "react";
import { ServiceManager } from "@stejar/di";
import { render } from "enzyme";
import { ServiceProvider } from "../src/ServiceProvider";
import { withServiceManager } from "../src/withServiceManager";

test("Should be able to use it", () => {
    const sm = new ServiceManager();

    interface Props {
        serviceManager?: ServiceManager;
    }

    @withServiceManager
    class App extends Component<Props> {
        render() {
            return (
                <div>
                    {this.props.serviceManager.constructor.name}
                </div>
            );
        }
    }

    const component = render(
        <ServiceProvider serviceManager={sm}>
            <App />
        </ServiceProvider>
    );

    expect(component.find('div').text()).toEqual("ServiceManager");
});
