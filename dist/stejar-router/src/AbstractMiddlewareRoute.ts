import {PlainRoute} from "react-router";

export interface RouteWithName extends PlainRoute {
	name?: string;
}

export interface RouterStateContract<P, Q> {
	routes: RouteWithName[];
	params: P;
	location: {
		query: Q;
	}
}

export interface RedirectorContract {
	(
		options: {
			name?: string;
			params?: Object;
			query?: Object;
		}
	): void;
}

export interface AbstractMiddlewareRoute {

	/**
	 * @param toState
	 * @param redirector
	 */
	onEnter?<P,Q>( toState: RouterStateContract<P,Q>, redirector: RedirectorContract ): Promise<any>;

	/**
	 * @param fromState
	 * @param toState
	 * @param redirector
	 */
	onChange?<P,Q>( fromState: RouterStateContract<P,Q>, toState: RouterStateContract<P,Q>, redirector: RedirectorContract ): Promise<any>;
}
