import React, {Component} from "react";

export interface RouteProps {
	name?: string;
	path?: string;
	middleware?: Function;
	component?: any;
}

export class Route extends Component<RouteProps,any> {}
