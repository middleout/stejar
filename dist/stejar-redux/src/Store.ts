import { Reducer, Store as ReduxStorer, Unsubscribe } from "redux";
import { injectable } from "@stejar/di";
import invariant from "invariant";
import { Action } from "./Action";

function checkStore( store: any ) {
	invariant(store, `[Stejar-Redux] You must "bootRedux()" before using the Store() class.`);
}

@injectable
export class Store<S> {

	/**
	 * @type {ReduxStorer<S>}
	 */
	protected store: ReduxStorer<S>;

	/**
	 * @constructor
	 */
	constructor() {
		this.dispatch       = this.dispatch.bind(this);
		this.bootRedux      = this.bootRedux.bind(this);
		this.getState       = this.getState.bind(this);
		this.subscribe      = this.subscribe.bind(this);
		this.replaceReducer = this.replaceReducer.bind(this);
	}

	/**
	 * @param store
	 */
	bootRedux( store: ReduxStorer<S> ) {
		this.store = store;
	}

	/**
	 * @param action
	 * @param payload
	 * @returns {A}
	 */
	dispatch<P>( action: Action<P>|string|any, payload?: P ) {
		checkStore(this.store);

		if ( typeof action !== "string" && action.constructor && action.constructor.name ) {
			action = {
				type   : action.constructor.name,
				payload: action
			}
		}

		return this.store.dispatch(payload || typeof action === "string" ? {
			type: action,
			payload
		} as any : action as any);
	};

	/**
	 * @returns {S}
	 */
	getState(): S {
		checkStore(this.store);
		return this.store.getState();
	}

	/**
	 * @param listener
	 * @returns {Unsubscribe}
	 */
	subscribe( listener: ()=>void ): Unsubscribe {
		checkStore(this.store);
		return this.store.subscribe(listener);
	}

	/**
	 * @param nextReducer
	 */
	replaceReducer( nextReducer: Reducer<S> ): void {
		checkStore(this.store);
		return this.store.replaceReducer(nextReducer);
	}
}
