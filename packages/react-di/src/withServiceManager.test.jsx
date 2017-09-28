import { Component } from "react";
import { ServiceManager } from "@stejar/di/ServiceManager";
import { render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ServiceProvider } from "../src/ServiceProvider";
import { withServiceManager } from "../src/withServiceManager";

configure({ adapter: new Adapter() });

test("Should be able to use it", () => {
    const sm = new ServiceManager();

    @withServiceManager
    class App extends Component {
        render() {
            return <div>{this.props.serviceManager.constructor.name}</div>;
        }
    }

    const component = render(
        <ServiceProvider serviceManager={sm}>
            <App />
        </ServiceProvider>
    );

    expect(component.text()).toEqual("ServiceManager");
});
