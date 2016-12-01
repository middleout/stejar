import { Component as ReactComponent } from "react";

export abstract class Component<P,S> extends ReactComponent<P,S> {

	props: P & { children?: any };

	/**
	 * @param props
	 * @param context
	 */
	constructor( props: P, context?: any ) {
		super(props, context);
		var keys: any[] = [];

		if ( typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function' ) {
			keys = Reflect.ownKeys(this.constructor.prototype);
		} else {
			keys = Object.getOwnPropertyNames(this.constructor.prototype);
			if ( typeof Object.getOwnPropertySymbols === 'function' ) {
				keys = keys.concat(Object.getOwnPropertySymbols(this.constructor.prototype));
			}
		}

		keys.forEach(( key ) => {

			// Ignore special case target method
			if ( key === 'constructor' ) {
				return;
			}

			if ( typeof this[ key ] === "function" ) {
				this[ key ] = this[ key ].bind(this);
			}

		});
	}

	/**
	 * @returns {null}
	 */
	componentWillMount(): void {
		return null;
	}

	/**
	 * @returns {JSX.Element}
	 */
	abstract render(): JSX.Element;

	/**
	 * @returns {null}
	 */
	componentDidMount(): void {
		return null;
	}

	/**
	 * @param nextProps
	 * @returns {null}
	 */
	componentWillReceiveProps( nextProps: P ): void {
		return null;
	}

	/**
	 * @returns {null}
	 */
	shouldComponentUpdate( nextProps: P, nextState: S ): boolean {
		return true;
	}

	/**
	 * @returns {null}
	 */
	componentWillUpdate( nextProps: P, nextState: S ): void {
		return null;
	}

	/**
	 * @returns {null}
	 */
	componentDidUpdate( prevProps: P, prevState: S ): void {
		return null;
	}

	/**
	 * @returns {null}
	 */
	componentWillUnmount(): void {
		return null;
	}
}
