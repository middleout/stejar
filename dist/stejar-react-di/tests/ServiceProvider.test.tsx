import "reflect-metadata";
import * as React from 'react';
import { render } from 'enzyme';
import { ServiceManager, injectable } from "./../../src/DI";
import { ServiceProvider } from "../../src/ReactDI/ServiceProvider";
import { inject } from "../../src/ReactDI/inject";

@injectable
class Tester {
	public value: string;

	public constructor() {
		this.value = "test";
	}
}

@injectable
class TesterWithDep {
	constructor( public tester: Tester ) {}
}

describe("ServiceProvider", () => {

	beforeEach(() => {
		this.sm = new ServiceManager();
	});

	it('can render the inner view', () => {

		class Application extends React.Component<any,any> {

			render() {
				return <div className="Application">Hello World</div>
			}
		}

		const component = render(<ServiceProvider serviceManager={this.sm}><Application /></ServiceProvider>);
		expect(component.find('.Application').text()).toEqual('Hello World');
	});

	it('can render the inner view with inject', () => {

		@inject({
			test: TesterWithDep
		})
		class Application extends React.Component<{test?: TesterWithDep},any> {

			render() {
				return <div className="Application">{this.props.test.tester.value}</div>
			}
		}

		const component = render(<ServiceProvider serviceManager={this.sm}><Application /></ServiceProvider>);
		expect(component.find('.Application').text()).toEqual('test');
	});

	it('can render the inner view with inject while providing all deps via props', () => {

		@inject({
			test: TesterWithDep
		})
		class Application extends React.Component<{test?: TesterWithDep},any> {

			render() {
				return <div className="Application">{this.props.test.tester.value}</div>
			}
		}

		const component = render(<ServiceProvider serviceManager={this.sm}><Application test={this.sm.get(TesterWithDep)} /></ServiceProvider>);
		expect(component.find('.Application').text()).toEqual('test');
	});
});
