import * as React from "react";
const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin();
import { render } from "react-dom";
import { injectable, ServiceManager } from "@stejar/di";

@injectable
export class DOMRenderer {

	/**
	 * @param serviceManager
	 */
	constructor( protected serviceManager: ServiceManager ) {}

	/**
	 * @param Component
	 * @param element
	 * @returns {Promise<any>}
	 */
	render( Component: any, element: HTMLElement = document.getElementById(".root") ): any {
		return render(<Component serviceManager={this.serviceManager} />, element);
	}
}
