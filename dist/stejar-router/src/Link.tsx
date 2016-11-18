import { Component, HTMLAttributes } from "react";
import { Link as ReactLink, RouterOnContext } from "react-router";
import { withRouter } from "./withRouter";

export interface LinkProps extends HTMLAttributes<any> {
	to?: {
		name?: string;
		params?: Object;
		query?: Object;
	} | string;
	router?: RouterOnContext;
	routes?: any[];
	params?: Object;
}

@withRouter
export class Link extends Component<LinkProps, {}> {

	render() {
		let props = Object.assign({}, this.props);
		let to    = props.to;
		if ( !to ) {
			to = {} as any;
		}
		delete props[ 'to' ];
		delete props[ 'router' ];
		delete props[ 'location' ];
		delete props[ 'routes' ];
		delete props[ 'params' ];

		if ( typeof to !== "string" ) {
			if ( to.params ) {
				(to as any).params = this.props.params;
			}
		} else {
			to = {
				name  : to,
				params: this.props.params
			}
		}

		return <ReactLink to={to} {...props}>{this.props.children}</ReactLink>;
	}
}
