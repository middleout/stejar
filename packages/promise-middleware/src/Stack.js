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

        /**
         * The error string which the promise chain will reject with if next() is not called
         * when the parent promise resumes run.
         *
         * @type {string}
         * @private
         */
        this._errorName = "@stejar/promise-middleware/StackError: Next not called";
    }

    /**
     * @returns {string}
     */
    getNextNotCalledError() {
        return this._errorName;
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
                    return Promise.reject(this._errorName);
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
