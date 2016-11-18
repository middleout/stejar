export function onEnterSync( resolve: Function ) {
	return async( a: Object, b: Function, c: Function ) => {
		await resolve(a, b);
		c();
	}
}

export function onChangeSync( resolve: Function ) {
	return async( a: Object, b: Object, c: Function, d: Function ) => {
		await resolve(a, b, c);
		d();
	}
}
