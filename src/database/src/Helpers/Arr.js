import { isExpression } from "./isExpression";

export class Arr {
    /**
     * @param array
     * @param depth
     * @return {*}
     */
    static flatten(array, depth = -1) {
        if (Array.isArray(array)) {
            return array.map(i => Arr._doFlatten(i, depth)).reduce((p, c) => p.concat(c), []);
        }

        return Arr._doFlatten(array, depth);
    }

    /**
     * @param item
     * @return {boolean}
     * @private
     */
    static _isObject(item) {
        return !isExpression(item) && null !== item && typeof item === "object" && !Array.isArray(item);
    }

    /**
     * @param array
     * @return {Array}
     * @private
     */
    static _doFlatten(array, depth = -1) {
        let result = [];
        Object.keys(array).forEach(key => {
            let item = array[key];

            if (this._isObject(item)) {
                item = Object.values(item);
            }

            if (!Array.isArray(item)) {
                result.push(item);
            } else if (depth === 1) {
                result = result.concat(item);
            } else {
                result = result.concat(Arr._doFlatten(item, depth - 1));
            }
        });

        return result;
    }
}
