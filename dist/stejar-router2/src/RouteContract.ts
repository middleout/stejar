import { Route } from "./Route";

export interface RouteOptions {
	name?: string;
	path?: string;
	middleware?: Function;
	callback?: Function;
	children?: Route[];
}
