export class Selector {

	/**
	 * @param selector
	 * @param left
	 * @param right
	 * @returns {(state:any, props?:any)=>(any|any|{})}
	 */
	static if( selector: Function, left: any, right?: any ) {
		return ( state: any, props?: any ) => {
			if ( selector(state, props) ) {
				return left ? (left(state, props) || {}) : {};
			} else if ( right ) {
				return right(state, props);
			} else {
				return {};
			}
		}
	}

	/**
	 * @param args
	 * @returns {(state:any, props?:any)=>{}}
	 */
	static fromState( ...args: any[] ) {
		return ( state: any, props?: any ) => {
			let struct = {};
			args.forEach(arg => {
				if ( typeof arg !== "function" ) {
					Object.keys(arg).forEach(key => {
						if ( typeof arg[ key ] === "function" ) {
							struct[ key ] = arg[ key ](state, props);
						} else {
							struct[ key ] = arg[ key ];
						}
					})
				} else {
					Object.assign(struct, arg(state, props));
				}
			});

			return struct;
		}
	}
}
