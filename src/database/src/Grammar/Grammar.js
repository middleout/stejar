import { Expression } from "../Expression";

export class Grammar {
    /**
     * @type {string}
     * @protected
     */
    _tablePrefix = "";

    /**
     * @param prefix
     * @return {Grammar}
     */
    setTablePrefix(prefix) {
        this._tablePrefix = prefix;
        return this;
    }

    /**
     * @param columns : Array<string|Expression>
     * @return {string}
     */
    columnize(columns) {
        return columns.map(item => this.wrap(item)).join(", ");
    }

    /**
     * @param values : Array<string|Expression>
     * @return {string}
     */
    parameterize(values) {
        return values.map(item => this.parameter(item)).join(", ");
    }

    /**
     * @param value : Expression|string
     * @return {string}
     */
    parameter(value) {
        return this.isExpression(value) ? this.getValue(value) : "?";
    }

    /**
     * Wrap a value in keyword identifiers.
     *
     * @param value : string|Expression
     * @param prefixAlias : boolean
     * @return {string}
     */
    wrap(value, prefixAlias = false) {
        if (this.isExpression(value)) {
            return this.getValue(value);
        }

        if (value.toLowerCase().includes(" as ")) {
            return this._wrapAliasedValue(value, prefixAlias);
        }

        return this._wrapSegments(value.split("."));
    }

    /**
     * Determine if the given value is a raw expression.
     *
     * @param value
     * @return {boolean}
     */
    isExpression(value) {
        return value instanceof Expression;
    }

    /**
     * Get the value of a raw expression.
     *
     * @param expression : Expression
     * @return {string}
     */
    getValue(expression) {
        return expression.getValue();
    }

    /**
     * Wrap a value that has an alias.
     *
     * @param value : string
     * @param prefixAlias : boolean
     * @private
     *
     * @returns {string}
     */
    _wrapAliasedValue(value, prefixAlias = false) {
        const segments = value.split(/\s+as\s+/i);

        // If we are wrapping a table we need to prefix the alias with the table prefix
        // as well in order to generate proper syntax. If this is a column of course
        // no prefix is necessary. The condition will be true when from wrapTable.
        if (prefixAlias) {
            segments[1] = this._tablePrefix + segments[1];
        }

        return this.wrap(segments[0]) + " as " + this._wrapValue(segments[1]);
    }

    /**
     * Wrap a single string in keyword identifiers.
     *
     * @param value : string
     * @return {string}
     * @private
     */
    _wrapValue(value) {
        if (value !== "*") {
            return '"' + value.replace('"', '""') + '"';
        }

        return value;
    }

    /**
     * Wrap the given value segments.
     *
     * @param segments : Array<string|Expression>
     * @return {string}
     * @private
     */
    _wrapSegments(segments) {
        return segments
            .map(
                (segment, key) =>
                    key === 0 && segments.length > 1 ? this._wrapTable(segment) : this._wrapValue(segment)
            )
            .join(".");
    }

    /**
     * Wrap a table in keyword identifiers.
     *
     * @param table : string|Expression
     * @return {string}
     * @private
     */
    _wrapTable(table) {
        if (!this.isExpression(table)) {
            return this.wrap(this._tablePrefix + table, true);
        }

        return this.getValue(table);
    }
}
