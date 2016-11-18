import { Component } from "react";
import { getDisplayName } from "recompose";
import { InjectedRouter, withRouter as ReactWithRouter } from "react-router";
const hoistStatics = require("hoist-non-react-statics");

export interface WithRouterProps<P,Q> {
	router?: InjectedRouter & {
		push( options: {name?: string, params?: Object; query?: Object} ): void;
	};
	params?: P;
	location?: {
		query: Q;
	}
	routes?: {name?: string, component?: any}[];
}

export function withRouter( WrappedComponent: any ) {

	const connectDisplayName = `WithRouter(${getDisplayName(WrappedComponent)})`;

	@ReactWithRouter
	class WithRouter extends Component<any,any> {

		protected router: InjectedRouter;

		/**
		 * @param props
		 */
		constructor( props: any ) {
			super(props);
			this.router      = props.router;
			const oldPush    = props.router.push;
			this.router.push = ( to: any ) => {
				if ( !to.name ) {
					const routes = props.routes.filter(( item: any ) => item.name);
					to.name      = routes.pop().name;
				}

				to.params = Object.assign({}, props.params, to.params || {});
				return oldPush(to);
			}
		}

		/**
		 * @type {string}
		 */
		static displayName: string = connectDisplayName;

		/**
		 * @type {any}
		 */
		static WrappedComponent: any = WrappedComponent;


		render() {
			const props = Object.assign({}, this.props, {router: this.router});
			return (
				<WrappedComponent {...props} />
			);
		}
	}

	return hoistStatics(WithRouter, WrappedComponent)
}
