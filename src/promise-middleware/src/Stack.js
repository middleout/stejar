export class Stack {
    /**
     * @type {Array}
     * @private
     */
    _container = [];

    /**
     * @param middleware
     * @returns {Stack}
     */
    add(middleware) {
        this._container.push(middleware);
        return this;
    }

    /**
     * @param args
     * @returns {*}
     */
    run(...args) {
        const next = () => {
            if (this._container.length === 0) {
                return Promise.resolve();
            }

            const current = this._container.shift();
            let result = current(...args);

            if (!result || !result.then) {
                result = Promise.resolve(result);
            }
            return result.then(() => next());
        };

        return next();
    }
}
