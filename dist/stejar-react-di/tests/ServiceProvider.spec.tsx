import "reflect-metadata";
import { injectable, ServiceManager } from "@stejar/di";
import { render } from "enzyme";
import * as React from "react";
import { inject } from "../src/inject";
import { ServiceProvider } from "../src/ServiceProvider";

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

	beforeEach(function () {
		this.sm = new ServiceManager();
	});

	it('can run tests', function () {
		expect(1).toEqual(1);
	});

	// it('can render the inner view', function () {
	//
	// 	class Application extends React.Component<any,any> {
	//
	// 		render() {
	// 			return <div className="Application">Hello World</div>
	// 		}
	// 	}
	//
	// 	const component = render(<ServiceProvider serviceManager={this.sm}><Application /></ServiceProvider>);
	// 	expect(component.find('.Application').text()).toEqual('Hello World');
	// });

	// it('can render the inner view with inject', function () {
	//
	// 	@inject({
	// 		test: TesterWithDep
	// 	})
	// 	class Application extends React.Component<{ test?: TesterWithDep },any> {
	//
	// 		render() {
	// 			return <div className="Application">{this.props.test.tester.value}</div>
	// 		}
	// 	}
	//
	// 	const component = render(<ServiceProvider serviceManager={this.sm}><Application /></ServiceProvider>);
	// 	expect(component.find('.Application').text()).toEqual('test');
	// });
	//
	// it('can render the inner view with inject while providing all deps via props', function () {
	//
	// 	@inject({
	// 		test: TesterWithDep
	// 	})
	// 	class Application extends React.Component<{ test?: TesterWithDep },any> {
	//
	// 		render() {
	// 			return <div className="Application">{this.props.test.tester.value}</div>
	// 		}
	// 	}
	//
	// 	const component = render(<ServiceProvider serviceManager={this.sm}><Application test={this.sm.get(TesterWithDep)} /></ServiceProvider>);
	// 	expect(component.find('.Application').text()).toEqual('test');
	// });
});
