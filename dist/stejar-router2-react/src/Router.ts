import { Component, createElement, PropTypes } from "react";
import { EVENTS, RouteMatcher, Router as StdRouter, RouteWithParent } from "@stejar/router-beta";

export interface RouterProps {
	router: StdRouter;
}

export interface RouterState {
	components: any[];
	params: Object;
	query: Object;
}

export class Router extends Component<RouterProps,RouterState> {
	/**
	 * @return {{router: Router}}
	 */
	getChildContext() {
		return {router: this.props.router};
	}

	/**
	 * @type {{router: React.Requireable<any>}}
	 */
	static childContextTypes = {
		router: PropTypes.instanceOf(StdRouter)
	};

	/**
	 * @type {{component: any}}
	 */
	state: RouterState = {
		components: [],
		params    : {},
		query     : {},
	};

	/**
	 * @param props
	 */
	constructor( props: RouterProps ) {
		super(props);

		if ( !props.router ) {
			throw new Error("You must provide the Router via props");
		}

		props.router.subscribe(EVENTS.ROUTE_MATCHED, ( matchedRoute: RouteMatcher, params: Object, query: Object ) => {
			let components             = [];
			let route: RouteWithParent = matchedRoute;

			while ( route ) {
				components.push(route.callback());
				route = route.parent;
			}

			this.setState({
				components,
				params: params,
				query : query
			});
		});
	}

	render() {
		if ( this.state.components.length === 0 ) {
			return null;
		}

		let components = this.state.components.slice(0);
		let component;
		while ( components.length > 0 ) {
			component = createElement(components.shift(), {
				params: this.state.params,
				query : this.state.query
			}, component);
		}

		return component;
	}

	componentDidMount() {
		this.props.router.start();
	}

	componentWillUnmount() {
		// this.props.router.stop();
	}
}
