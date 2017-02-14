import { assign } from "lodash";
import { Component, createElement } from "react";
import { ServiceManager } from "@stejar/di";
const invariant = require("invariant");
const hoistStatics = require("hoist-non-react-statics");
import { shape } from "./shape";

function getDisplayName( WrappedComponent: any ): string {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * @param mapItemsToProps
 * @returns {function(any): any}
 */
export function inject( mapItemsToProps: Object ) {
	return function wrapWithConnect( WrappedComponent: any ) {
		const connectDisplayName = `Inject(${getDisplayName(WrappedComponent)})`;

		class Connect extends Component<any,any> {

			/**
			 * @type {string}
			 */
			static displayName: string = connectDisplayName;

			/**
			 * @type {any}
			 */
			static WrappedComponent: any = WrappedComponent;

			/**
			 * @type {{serviceManager: Requireable<any>}}
			 */
			static contextTypes = {
				serviceManager: shape
			};

			/**
			 * @type {{serviceManager: Requireable<any>}}
			 */
			static propTypes = {
				serviceManager: shape
			};

			state: any = {
				hasEverythingItNeeds: false
			}

			/**
			 * @type {ServiceManager}
			 */
			protected serviceManager: ServiceManager;

			/**
			 * @param props
			 * @param context
			 */
			constructor( props: any, context: any ) {
				super(props, context)
				this.serviceManager = props.serviceManager || context.serviceManager;

				let hasUndefined = Object.keys(props).length === 0 && Object.keys(mapItemsToProps).length > 0 ? true : false;
				Object.keys(props).forEach(key => {
					if ( -1 === Object.keys(mapItemsToProps).indexOf(key) ) {
						hasUndefined = true;
					}
				})

				if ( hasUndefined ) {
					invariant(this.serviceManager,
						`Could not find "serviceManager" in either the context or ` +
						`props of "${connectDisplayName}". ` +
						`Either wrap the root component in a <Provider>, ` +
						`or explicitly pass "serviceManager" as a prop to "${connectDisplayName}".`
					);
				} else {
					this.state.hasEverythingItNeeds = true;
				}
			}

			render() {

				let toInject = {};
				if ( !this.state.hasEverythingItNeeds ) {
					let data = {};
					Object.keys(mapItemsToProps).forEach(key => {
						data[ key ] = this.serviceManager.get(mapItemsToProps[ key ]);
					});
					toInject = assign({}, this.props, data);
				} else {
					toInject = this.props;
				}

				return createElement(WrappedComponent, toInject);
			}
		}

		return hoistStatics(Connect, WrappedComponent)
	}
}
