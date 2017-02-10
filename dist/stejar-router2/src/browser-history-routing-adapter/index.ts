import { History } from "history";
import createBrowserHistory, { BrowserHistoryBuildOptions } from "history/createBrowserHistory";
import { RoutingAdapterContract } from "../RoutingAdapterContract";
import { QueryParser } from "../QueryParser";

export class BrowserHistoryAdapter implements RoutingAdapterContract {

	/**
	 * @type {History}
	 */
	protected history: History;

	/**
	 * @param options
	 */
	constructor( options: BrowserHistoryBuildOptions = {} ) {
		this.history = createBrowserHistory(options);
	}

	/**
	 * @param callback
	 * @return {UnregisterCallback}
	 */
	start( callback: ( path: string, query: Object ) => void ): Function {
		const unlisten = this.history.listen(( location ) => {
			callback(location.pathname, QueryParser.toObject(location.search));
		});

		callback(this.history.location.pathname, QueryParser.toObject(this.history.location.search));
		return unlisten;
	}

	/**
	 * @param url
	 */
	navigate( url: string ): void {
		this.history.push(url);
	}
}
