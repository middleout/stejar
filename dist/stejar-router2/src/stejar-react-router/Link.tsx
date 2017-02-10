import React, { Component, PropTypes } from "react";
import { EVENTS } from "../Events";
import { Router } from "../Router";

export interface LinkProps {
	[key: string]: any;
	to?: string;
	params?: Object;
	query?: Object;
}

export class Link extends Component<LinkProps, {}> {

	/**
	 * @type {{router: React.Requireable<any>}}
	 */
	static contextTypes = {router: PropTypes.instanceOf(Router)};

	render() {
		const props = {...this.props};
		delete props.to;
		delete props.params;
		delete props.query;

		const url      = this.context.router.buildUrl(this.props.to, this.props.params, this.props.query);
		const navigate = ( e: Event ) => {
			e.preventDefault();
			this.context.router.navigate(this.props.to, this.props.params, this.props.query)
		};

		return (
			<a href={url} onClick={navigate as any} {...props}>
				{this.props.children}
			</a>
		)
	}

	protected listener = () => {
		this.setState({});
	};

	/**
	 * @returns {null}
	 */
	componentDidMount(): void {
		this.context.router.subscribe(EVENTS.ROUTE_MATCHED, this.listener);
		return null;
	}

	/**
	 * @returns {null}
	 */
	componentWillUnmount(): void {
		this.context.router.unsubscribe(EVENTS.ROUTE_MATCHED, this.listener);
		return null;
	}
}
