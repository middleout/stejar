import { Arr, Grammar } from "@stejar/database";

export class MySqlGrammar extends Grammar {
    /**
     * @param query : Builder
     * @returns {string}
     */
    compileSelect(query) {
        let sql = super.compileSelect(query);

        // TODO
        // if (query.getUnions()) {
        //
        // }

        return sql;
    }

    /**
     * @param query : Builder
     * @param values
     * @returns {string}
     */
    compileUpdate(query, values) {
        const table = this._wrapTable(query.getFrom());

        // Each one of the columns in the update statements needs to be wrapped in the
        // keyword identifiers, also a place-holder needs to be created for each of
        // the values in the list of bindings so we can make the sets statements.
        const columns = this._compileUpdateColumns(values);

        const joins = "";

        // TODO
        // if (query.getJoins()) {
        //
        // }

        const where = this._compileWheres(query);

        let sql = `update ${table}${joins} set ${columns} ${where}`.trim();

        if (query.getOrders()) {
            sql += this._compileOrders(query, query.getOrders());
        }

        // TODO
        if (query.getLimit()) {
            sql += " " + this._compileLimit(query, query.getLimit());
        }

        return sql.trim();
    }

    /**
     * @param query
     * @return {string}
     */
    compileDelete(query) {
        const table = this._wrapTable(query.getFrom());

        const where = Array.isArray(query.getWheres()) ? this._compileWheres(query) : "";

        return this._compileDeleteWithoutJoins(query, table, where);
    }

    /**
     * @param seed : string
     * @return {string}
     */
    compileRandom(seed) {
        return "RAND(" + seed + ")";
    }

    /**
     * @param bindings
     * @param values
     * @return {*}
     */
    prepareBindingsForUpdate(bindings, values) {
        const cleanBindings = Object.keys(bindings)
            .filter(key => !["join", "select"].includes(key))
            .map(key => bindings[key]);

        return bindings.join.concat(Object.values(values)).concat(Arr.flatten(cleanBindings));
    }

    /**
     * @param values
     * @return {string}
     * @private
     */
    _compileUpdateColumns(values) {
        return Object.keys(values)
            .map(key => this.wrap(key) + " = " + this.parameter(values[key]))
            .join(", ");
    }

    /***
     * Wrap a single string in keyword identifiers.
     *
     * @param value
     * @return {*}
     * @private
     */
    _wrapValue(value) {
        if (value === "*") {
            return value;
        }

        return "`" + value.replace("`", "``") + "`";
    }

    /**
     * @param query
     * @param table
     * @param where
     * @return {string}
     * @private
     */
    _compileDeleteWithoutJoins(query, table, where) {
        let sql = `delete from ${table} ${where}`.trim();

        // When using MySQL, delete statements may contain order by statements and limits
        // so we will compile both of those here. Once we have finished compiling this
        // we will return the completed SQL statement so it will be executed for us.
        if (query.getOrders()) {
            sql += this._compileOrders(query, query.getOrders());
        }

        if (query.getLimit()) {
            sql += this._compileLimit(query, query.getLimit());
        }

        return sql;
    }
}
