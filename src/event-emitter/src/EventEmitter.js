export class EventEmitter {
    /**
     * @type {Object}
     * @private
     */
    _listeners = {};

    /**
     * @param event
     * @param payload
     */
    dispatch(event, payload) {
        if (typeof event !== "string") {
            event = event.constructor.name; // support events as instances of classes
        }

        (this._listeners[event] || []).forEach(listener => listener(payload));
    }

    /**
     * @param listener
     * @returns {function()}
     */
    subscribe(event, listener) {
        if (typeof event !== "string") {
            event = event.name; // support events as classes
        }

        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }

        this._listeners[event].push(listener);

        return () => {
            delete this._listeners[event][this._listeners[event].indexOf(listener)];
        };
    }
}
