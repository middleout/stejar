/**
 * @param topic
 * @param payload
 * @param origin
 * @param target
 */
export function postMessage( topic: string, payload?: any, origin = "*", target: Window = window ): void {

	payload = JSON.stringify(payload);

	target.postMessage({
		topic,
		payload
	}, origin);
}

/**
 * @param topic
 * @param callback
 * @returns {(event:{data: {topic: any, payload: any}})=>undefined}
 */
export function addCrossDomainEventListener( topic: string, callback: Function ): Function {

	const listener = ( event: {data: {topic: any, payload: any}} ) => {
		if ( !event.data.topic ) {
			return;
		}
		if ( event.data.topic != topic ) {
			return;
		}

		let payload = event.data.payload;
		if ( undefined === payload ) {
			payload = null;
		}

		callback(payload ? JSON.parse(payload) : {});
	};

	const eventMethod  = window.addEventListener ? "addEventListener" : "attachEvent";
	const eventer      = window[ eventMethod ];
	const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	eventer(messageEvent, listener, false);
	return listener;
}

/**
 * @param listener
 */
export function removeCrossDomainEventListener( listener: Function ): void {
	const eventMethod  = window.removeEventListener ? "removeEventListener" : "detachEvent";
	const eventer      = window[ eventMethod ];
	const messageEvent = eventMethod == "detachEvent" ? "onmessage" : "message";
	eventer(messageEvent, listener, false);
}

export class Channel {

	/**
	 * @param origin
	 * @param target
	 */
	constructor( private origin: string, private target: Window = window ) {}

	/**
	 * @param topic
	 * @param callback
	 * @returns {Function}
	 */
	subscribe( topic: string, callback: Function ) {
		return addCrossDomainEventListener(topic, callback);
	}

	/**
	 * @param listener
	 */
	unsuscribe( listener: Function ): void {
		return removeCrossDomainEventListener(listener);
	}

	/**
	 * @param topic
	 * @param payload
	 */
	send( topic: string, payload?: any ): void {
		return postMessage(topic, payload, this.origin, this.target);
	}
}
