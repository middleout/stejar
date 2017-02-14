import { EVENTS, RouteMatcher, Router as StdRouter, RouteWithParent } from "@stejar/router-beta";
import { Children, Component, createElement, PropTypes } from "react";
import { convertReactComponentRoutesToStandardRoutes } from "./convertReactComponentRoutesToStandardRoutes";

export interface RouterProps {
	router: StdRouter;
}

export interface RouterState {
	components: any[];
	params: Object;
	query: Object;
	middlewareResult: any;
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
		components      : [],
		params          : {},
		query           : {},
		middlewareResult: null,
	};

	/**
	 * @param props
	 */
	constructor( props: RouterProps ) {
		super(props);

		if ( !props.router ) {
			throw new Error("You must provide the Router via props");
		}

		props.router.subscribe(EVENTS.ROUTE_MATCHED, ( matchedRoute: RouteMatcher, data: { params: Object, query: Object, middlewareResult: any } ) => {
			let components             = [];
			let route: RouteWithParent = matchedRoute;

			while ( route ) {
				const component = route.callback();
				if ( component ) {
					components.push(route.callback());
				}
				route = route.parent;
			}

			this.setState({
				components,
				...data
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
				params : this.state.params,
				query  : this.state.query,
				resolve: this.state.middlewareResult,
			}, component);
		}

		return component;
	}

	componentDidMount() {
		if ( this.props.children ) {
			this.props.router.add(convertReactComponentRoutesToStandardRoutes(Children.only(this.props.children)));
		}

		this.props.router.start();
	}

	componentWillUnmount() {
		// this.props.router.stop();
	}
}
