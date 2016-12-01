export function popupWindow( url: string, title?: string, width: number = 800, height: number = 600 ) {

	var y         = window.outerHeight / 2 + window.screenY - ( height / 2);
	var x         = window.outerWidth / 2 + window.screenX - ( width / 2);
	var newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + y + ', left=' + x);

	// Puts focus on the newWindow
	if ( window.focus ) {
		newWindow.focus();
	}
}
