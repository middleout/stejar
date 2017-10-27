import { Component } from "react";
import { ServiceManager } from "@stejar/di/ServiceManager";
import { injectable } from "@stejar/di/injectable";
import { render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ServiceProvider } from "../src/ServiceProvider";
import { inject } from "../src/inject";

configure({ adapter: new Adapter() });

test("Should be able to use it", () => {
    const sm = new ServiceManager();

    @injectable()
    class Tester {}

    @inject({
        Tester: Tester,
    })
    class App extends Component {
        render() {
            return <div>{this.props.Tester.constructor.name}</div>;
        }
    }

    const component = render(
        <ServiceProvider serviceManager={sm}>
            <App />
        </ServiceProvider>
    );

    expect(component.text()).toEqual("Tester");
});
