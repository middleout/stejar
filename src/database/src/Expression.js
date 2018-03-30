export class Expression {
    /**
     * @param value
     */
    constructor(value) {
        /**
         * @type string
         * @private
         */
        this._value = value;
    }

    /**
     * @return {string}
     */
    getValue() {
        return this._value;
    }
}
