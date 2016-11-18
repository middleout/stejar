require("babel-polyfill");
require("react");
require("es6-promise").polyfill();
import { render } from "react-dom";
import { ServiceManager } from "@stejar/di";
const injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin();

/**
 * @class BrowserApplication
 */
export class BrowserApplication extends ServiceManager {

	/**
	 * @param Component
	 * @param element
	 * @returns {Promise<any>}
	 */
	render( Component: any, element: HTMLElement = document.getElementById(".root") ): any {
		return render(<Component serviceManager={this} />, element);
	}
}
