export function newWindow( url: string) {
	var newWindow = window.open(url, '_blank');

	// Puts focus on the newWindow
	if ( window.focus ) {
		newWindow.focus();
	}
}
