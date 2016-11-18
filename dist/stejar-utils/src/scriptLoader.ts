export function loadScript( url: string, timeout: number = 30000 ): Promise<any> {
	return new Promise(( resolve, reject ) => {
		var script: any = document.createElement('script');
		var prior       = document.getElementsByTagName('script')[ 0 ];
		script.async    = 1;
		prior.parentNode.insertBefore(script, prior);

		let resolved   = false;
		let timeoutVar = setTimeout(() => {
			if ( !resolved ) {
				reject();
			}
		}, timeout);

		script.onload = script.onreadystatechange = function ( _: any, isAbort: boolean ) {
			if ( isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
				script.onload = script.onreadystatechange = null;
				script = undefined;

				if ( !isAbort ) {
					resolved = true;
					clearTimeout(timeoutVar);
					resolve();
				}
			}
		};

		script.src = url;
	});
}
