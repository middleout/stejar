/**
 * @param url
 * @returns {Promise<T>}
 */
export function loadImage( url: string ): Promise<string> {
	return new Promise(( resolve, reject ) => {
		const img   = new Image();
		img.onload  = () => resolve(url);
		img.onerror = () => reject(url);
		img.onabort = () => reject(url);
		img.src     = url;
	})
}

/**
 * @param url
 * @returns {Promise<T>}
 */
export function loadImages( urls: string[] ): Promise<string[]> {
	return Promise.all(urls.map(url => loadImage(url)));
}
