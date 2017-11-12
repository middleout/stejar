export class Stack {
    /**
     * @constructor
     */
    constructor() {
        /**
         * This holds the reference to the queue items.
         *
         * @type {Array}
         * @private
         */
        this._container = [];

        /**
         * Keeps track of what next() was called for what promise
         *
         * @type {{}}
         * @private
         */
        this._tracking = {};

        /**
         * The current Promise index
         *
         * @type {number}
         * @private
         */
        this._index = 0;
    }

    /**
     * @param item
     * @returns {Stack}
     */
    add(item) {
        this._container.push(item);
        return this;
    }

    /**
     * @param args
     * @returns {Promise.<T>}
     */
    process(...args) {
        if (this._container.length === 0) {
            return Promise.resolve();
        }

        const current = this._container.shift();

        this._index++;
        this._tracking[this._index] = false;

        return (index => {
            return current(...args, () => {
                this._tracking[index] = true;
                return this.process(...args);
            }).then(data => {
                if (!this._tracking[index]) {
                    return;
                }

                return data;
            });
        })(this._index);
    }

    /**
     * @param args
     * @returns {Promise.<T>}
     */
    run(...args) {
        return this.process(...args).catch(err => {
            if (err === this._errorName) {
                return;
            }

            throw err;
        });
    }
}
