import { injectable } from "@stejar/di";
import { ReducerStore } from "@stejar/redux";
import { AuthenticatedAction } from "./AuthenticatedAction";
import { LoggedOutAction } from "./LoggedOutAction";

@injectable
export class AuthenticationStore<I> extends ReducerStore {

	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.bind(null, (): null => null);
		this.bind(AuthenticatedAction.name, this.authenticated)
		this.bind(LoggedOutAction.name, this.loggedOut)
	}

	/**
	 * @param state
	 * @param payload
	 * @returns {{}&U&AppConfig}
	 */
	protected authenticated( state: any, payload: AuthenticatedAction<I> ) {
		return Object.assign({}, state, payload.identity);
	}

	/**
	 * @param state
	 * @param payload
	 * @returns {{}&U&AppConfig}
	 */
	protected loggedOut( state: any, payload: LoggedOutAction ) {
		return {};
	}
}
