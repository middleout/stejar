import { DOM } from 'react';

/**
 * @param props
 * @returns {any}
 * @constructor
 */
export function DangerousHtml( props: any ) {
	let newProps: any                         = Object.assign({}, props);
	(newProps as any).dangerouslySetInnerHTML = {
		__html: props.children as string
	};
	delete newProps.children;
	var type = newProps.type;
	delete newProps.type;
	if ( !(newProps as any).className ) {
		(newProps as any).className = 'dangerousHtml';
	} else {
		(newProps as any).className += ' dangerousHtml';
	}
	return DOM[ type || 'span' ](newProps);
}
