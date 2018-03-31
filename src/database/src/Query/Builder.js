import { Expression } from "../Expression";
import { Arr } from "../Helpers/Arr";

export class Builder {
    /**
     * @param connection
     * @param grammar
     */
    constructor(connection, grammar) {
        /**
         * @type Connection
         * @private
         */
        this._connection = connection;

        /**
         * @type Grammar
         * @private
         */
        this._grammar = grammar;

        /**
         * @type {string}
         * @private
         */
        this._identifier = "id";

        /**
         * @type {null}
         * @private
         */
        this._orders = null;

        /**
         * @type {null}
         * @private
         */
        this._unionOrders = null;

        /**
         * @type {null}
         * @private
         */
        this._groups = null;

        /**
         * @type {string[]}
         * @private
         */
        this._operators = [
            "=",
            "<",
            ">",
            "<=",
            ">=",
            "<>",
            "!=",
            "<=>",
            "like",
            "like binary",
            "not like",
            "ilike",
            "&",
            "|",
            "^",
            "<<",
            ">>",
            "rlike",
            "regexp",
            "not regexp",
            "~",
            "~*",
            "!~",
            "!~*",
            "similar to",
            "not similar to",
            "not ilike",
            "~~*",
            "!~~*",
        ];

        /**
         * @type {Array<{
         *  type: "Basic"|"NotIn"|"In"|"NotNull"|"Null","NotExists","Exists"
         *  column?: string,
         *  query?: Builder,
         *  operator?: string,
         *  value?: string|number,
         *  values?: string|number,
         *  boolean: "and"|"or"
         * }>}
         * @private
         */
        this._wheres = [];

        /**
         * @type {Array}
         * @private
         */
        this._unions = null;

        /**
         * @type {{
         *  select: Array,
         *  from: Array,
         *  join: Array,
         *  where: Array,
         *  having: Array,
         *  order: Array,
         *  union: Array
         * }}
         * @private
         */
        this._bindings = {
            select: [],
            from: [],
            join: [],
            where: [],
            having: [],
            order: [],
            union: [],
        };

        /**
         * @type {Null|string}
         * @private
         */
        this._from = null;

        /**
         * @type {undefined|Array<*>}
         * @private
         */
        this._columns = null;

        /**
         * @type {undefined|Array<*>}
         * @private
         */
        this._aggregate = null;

        /**
         * @type {boolean}
         * @private
         */
        this._distinct = false;

        /**
         * @type {Null|number}
         * @private
         */
        this._offset = null;

        /**
         * @type {Null|number}
         * @private
         */
        this._unionOffset = null;

        /**
         * @type {Null|number}
         * @private
         */
        this._limit = null;
        /**
         * @type {Null|number}
         * @private
         */

        this._unionLimit = null;
    }

    /**
     * @return {Array<*>}
     */
    getColumns() {
        return this._columns;
    }

    /**
     * @param columns
     * @return {Builder}
     */
    columns(columns) {
        this._columns = columns;
        return this;
    }

    /**
     * @return {Array<*>}
     */
    getAggregate() {
        return this._aggregate;
    }

    /**
     * @return {boolean}
     */
    getDistinct() {
        return this._distinct;
    }

    getOrders() {
        return null;
    }

    /**
     * @return {string|Null}
     */
    getFrom() {
        return this._from;
    }

    /**
     * @return {Null|number}
     */
    getLimit() {
        return this._limit;
    }

    /**
     * @return {Null|number}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * Set the table which the query is targeting.
     *
     * @param table
     * @returns {Builder}
     */
    from(table) {
        this._from = table;

        return this;
    }

    /**
     * Set the table which the query is targeting.
     *
     * @param table
     * @returns {Builder}
     */
    table(table) {
        return this.from(table);
    }

    /**
     * @return {Array<{type: string, column: string, operator?: string, value?: string|number, values?: string|number, boolean: string}>|Null}
     */
    getWheres() {
        return this._wheres;
    }

    /**
     * Add a basic where clause to the query.
     *
     * @param args
     * @returns {Builder}
     */
    where(...args) {
        let [column, operator = null, value = null, boolean = "and"] = args;

        // Here we will make some assumptions about the operator. If only 2 values are
        // passed to the method, we will assume that the operator is an equals sign
        // and keep going. Otherwise, we'll require the operator to be passed in.
        [value, operator] = this._prepareValueAndOperator(value, operator, args.length === 2);

        // If the columns is actually a Closure instance, we will assume the developer
        // wants to begin a nested where statement which is wrapped in parenthesis.
        // We'll add that Closure to the query then return back out immediately.
        if (typeof column === "function") {
            // TODO
            return this;
        }

        // If the given operator is not found in the list of valid operators we will
        // assume that the developer is just short-cutting the '=' operators and
        // we will set the operators to '=' and set the values appropriately.
        if (this._invalidOperator(operator)) {
            [value, operator] = [operator, "="];
        }

        // If the value is a Closure, it means the developer is performing an entire
        // sub-select within the query and we will need to compile the sub-select
        // within the where clause to get the appropriate query record results.
        if (typeof value === "function") {
            // TODO
            return this;
        }

        // If the value is "null", we will just assume the developer wants to add a
        // where null clause to the query. So, we will allow a short-cut here to
        // that method for convenience so the developer doesn't have to check.
        if (value === null) {
            return this.whereNull(column, boolean, operator !== "=");
        }

        const type = "Basic";
        this._wheres.push({ type, column, operator, value, boolean });

        if (!(value instanceof Expression)) {
            this._addBinding(value, "where");
        }

        return this;
    }

    /**
     * Add an "or where" clause to the query.
     *
     * @param args
     * @returns {Builder}
     */
    orWhere(...args) {
        let [column, operator = null, value = null] = args;

        [value, operator] = this._prepareValueAndOperator(value, operator, args.length === 2);

        return this.where(column, operator, value, "or");
    }

    /**
     * Add a "where in" clause to the query.
     *
     * @param args
     * @returns {Builder}
     */
    whereIn(...args) {
        let [column, values, boolean = "and", not = false] = args;
        const type = not ? "NotIn" : "In";

        // If the value is a query builder instance we will assume the developer wants to
        // look for any values that exists within this given query. So we will add the
        // query accordingly so that this query is properly executed when it is run.
        if (values instanceof Builder) {
            // TODO
            return this;
        }

        // If the value of the where in clause is actually a Closure, we will assume that
        // the developer is using a full sub-select for this "in" statement, and will
        // execute those Closures, then we can re-construct the entire sub-selects.
        if (typeof values === "function") {
            // TODO
            return this;
        }

        if (values.length === 0) {
            return this;
        }

        this._wheres.push({ type, column, values, boolean });

        values.forEach(value => {
            if (!(value instanceof Expression)) {
                this._addBinding(value, "where");
            }
        });

        return this;
    }

    /**
     * Add an "or where in" clause to the query.
     *
     * @param column
     * @param values
     * @returns {Builder}
     */
    orWhereIn(column, values) {
        return this.whereIn(column, values, "or");
    }

    /**
     * Add a "where not in" clause to the query.
     *
     * @param column
     * @param values
     * @param boolean
     * @returns {Builder}
     */
    whereNotIn(column, values, boolean = "and") {
        return this.whereIn(column, values, boolean, true);
    }

    /**
     * Add an "or where not in" clause to the query.
     *
     * @param column
     * @param values
     * @returns {Builder}
     */
    orWhereNotIn(column, values) {
        return this.whereNotIn(column, values, "or");
    }

    /**
     * Add an "where null" clause to the query.
     *
     * @param column
     * @param boolean
     * @param not : boolean
     * @returns {Builder}
     */
    whereNull(column, boolean = "and", not = false) {
        const type = not ? "NotNull" : "Null";

        this._wheres.push({
            type,
            column,
            boolean,
        });

        return this;
    }

    /**
     * Add an "or where null" clause to the query.
     *
     * @param column
     * @returns {Builder}
     */
    orWhereNull(column) {
        return this.whereNull(column, "or");
    }

    /**
     * Add a "where not null" clause to the query.
     *
     * @param column
     * @param boolean
     * @returns {Builder}
     */
    whereNotNull(column, boolean = "and") {
        return this.whereNull(column, boolean, true);
    }

    /**
     * Add an exists clause to the query.
     *
     * @param callback
     * @param boolean : "and"|"or"
     * @param not : boolean
     * @return {Builder}}
     */
    whereExists(callback, boolean = "and", not = false) {
        const query = this._forSubQuery();

        // Similar to the sub-select clause, we will create a new query instance so
        // the developer may cleanly specify the entire exists query and we will
        // compile the whole thing in the grammar and insert it into the SQL.
        callback(query);

        return this._addWhereExistsQuery(query, boolean, not);
    }

    /**
     * Add an or exists clause to the query.
     *
     * @param callback
     * @param not : boolean
     * @return {Builder}
     */
    orWhereExists(callback, not = false) {
        return this.whereExists(callback, "or", not);
    }

    /**
     * Add a where not exists clause to the query.
     *
     * @param callback
     * @param boolean
     * @return {Builder}
     */
    whereNotExists(callback, boolean = "and") {
        return this.whereExists(callback, boolean, true);
    }

    /**
     * Add a where not exists clause to the query.
     *
     * @param callback
     * @return {Builder}
     */
    orWhereNotExists(callback) {
        return this.orWhereExists(callback, true);
    }

    /**
     * @param query
     * @param boolean : "and"|"or"
     * @param not
     * @return {Builder}
     * @private
     */
    _addWhereExistsQuery(query, boolean = "and", not = false) {
        const type = not ? "NotExists" : "Exists";

        this._wheres.push({ type, query, boolean });
        this._addBinding(query._getBindings(), "where");

        return this;
    }

    /**
     * @return {Builder}
     * @private
     */
    _forSubQuery() {
        return this._newQuery();
    }

    /**
     * @return {Builder}
     * @private
     */
    _newQuery() {
        return new Builder(this._connection, this._grammar);
    }

    /**
     *  Add an "order by" clause to the query.
     *
     * @param column : string
     * @param direction : string
     * @return {Builder}
     */
    orderBy(column, direction) {
        const item = {
            column,
            direction: direction.toLowerCase() === "asc" ? "asc" : "desc",
        };

        if (this._unions) {
            if (null === this._unionOrders) {
                this._unionOrders = [];
            }
            this._unionOrders.push(item);
        } else {
            if (null === this._orders) {
                this._orders = [];
            }
            this._orders.push(item);
        }

        return this;
    }

    /**
     * Add a descending "order by" clause to the query.
     *
     * @param column : string
     * @return {Builder}
     */
    orderByDesc(column) {
        return this.orderBy(column, "desc");
    }

    /**
     * Add a ascneding "order by" clause to the query.
     *
     * @param column : string
     * @return {Builder}
     */
    orderByAsc(column) {
        return this.orderBy(column, "asc");
    }

    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param column : string
     * @return {Builder}
     */
    latest(column = "created_at") {
        return this.orderBy(column, "desc");
    }

    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param column : string
     * @return {Builder}
     */
    oldest(column = "created_at") {
        return this.orderBy(column, "asc");
    }

    /**
     * Put the query's results in random order.
     *
     * @param seed : string
     * @return {*}
     */
    inRandomOrder(seed = "") {
        return this.orderByRaw(this._grammar.compileRandom(seed));
    }

    /**
     * Add a raw "order by" clause to the query.
     *
     * @param sql : string
     * @param bindings : Array
     * @return {Builder}
     */
    orderByRaw(sql, bindings = []) {
        const type = "Raw";
        if (this._unions) {
            if (null === this._unionOrders) {
                this._unionOrders = [];
            }
            this._unionOrders.push({ type, sql });
        } else {
            if (null === this._orders) {
                this._orders = [];
            }
            this._orders.push({ type, sql });
        }

        this._addBinding(bindings, "order");

        return this;
    }

    /**
     * Alias to set the "offset" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */
    skip(value) {
        return this.offset(value);
    }

    /**
     * Set the "offset" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */
    offset(value) {
        if (this._unions) {
            this._unionOffset = Math.max(0, value);
        } else {
            this._offset = Math.max(0, value);
        }

        return this;
    }

    /**
     * Alias to set the "limit" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */
    take(value) {
        return this.limit(value);
    }

    /**
     * Set the "limit" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */
    limit(value) {
        if (this._unions) {
            if (value >= 0) {
                this._unionLimit = value;
            }
        } else {
            if (value >= 0) {
                this._limit = value;
            }
        }

        return this;
    }

    /**
     * Set the limit and offset for a given page.
     *
     * @param page : number
     * @param perPage : number
     * @return {Builder}
     */
    forPage(page, perPage = 15) {
        return this.skip((page - 1) * perPage).take(perPage);
    }

    /**
     * Constrain the query to the next "page" of results after a given ID.
     *
     * @param perPage : number
     * @param lastId : *
     * @param column : string
     * @return {Builder}
     */
    forPageAfterId(perPage = 15, lastId = 0, column = "id") {
        this._orders = this._removeExistingOrdersFor(column);

        return this.where(column, ">", lastId)
            .orderByAsc(column)
            .take(perPage);
    }

    /**
     * @param column : string
     * @return {*}
     * @private
     */
    _removeExistingOrdersFor(column) {
        return this._orders.filter(order => order.column !== column);
    }

    /**
     * Get the SQL representation of the query.
     *
     * @returns {string|Array<string|*>}
     */
    toSql(withBindings = false) {
        if (withBindings) {
            return [this._grammar.compileSelect(this), this._getBindings()];
        }

        return this._grammar.compileSelect(this);
    }

    /**
     * @param value
     * @return {*}
     */
    raw(value) {
        return this._connection.raw(value);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    count(column = ["*"]) {
        return this.aggregate("count", Array.isArray(column) ? column : [column]);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    min(column) {
        return this.aggregate("min", Array.isArray(column) ? column : [column]);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    max(column) {
        return this.aggregate("max", Array.isArray(column) ? column : [column]);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    sum(column) {
        return this.aggregate("sum", Array.isArray(column) ? column : [column]);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    avg(column) {
        return this.aggregate("avg", Array.isArray(column) ? column : [column]);
    }

    /**
     * @param column
     * @returns {Promise<Number>}
     */
    average(column) {
        return this.avg(column);
    }

    /**
     * @param func : string
     * @param columns : Array
     * @return {Promise<Number|Null>}
     */
    aggregate(func, columns = ["*"]) {
        const query = this._resetColumns()
            ._resetBindings(["select"])
            ._setAggregate(func, columns);

        return query.get().then(results => {
            if (results.length === 0) {
                return null;
            }

            return results[0].aggregate;
        });
    }

    /**
     * Execute the query as a "select" statement.
     *
     * @return {Promise<*>}
     */
    get() {
        return this._runSelect();
    }

    /**
     * @param id
     * @return {Promise<*>}
     */
    first(id = null) {
        if (id) {
            this.where(this._identifier, "=", id);
        }
        return this.get().then(results => (results.length > 0 ? results[0] : null));
    }

    /**
     * Insert a new record into the database.
     *
     * @param values
     * @return {Promise<*>}
     */
    insert(values) {
        // Since every insert gets treated like a batch insert, we will make sure the
        // bindings are structured in a way that is convenient when building these
        // inserts statements by verifying these elements are actually an array.
        if (Array.isArray(values)) {
            if (values.length === 0) {
                return Promise.resolve(true);
            }
        } else {
            if (Object.keys(values).length === 0) {
                return Promise.resolve(true);
            }

            values = [values];
        }

        // Finally, we will run this query against the database connection and return
        // the results. We will need to also flatten these bindings before running
        // the query so they are all in one huge, flattened array for execution.

        return this._connection.insert(
            this._grammar.compileInsert(this, values),
            this._cleanBindings(Arr.flatten(values))
        );
    }

    /**
     * Update a record in the database.
     *
     * @param values
     * @param value
     * @return {Promise<boolean>}
     */
    update(values, value = undefined) {
        if (value !== undefined) {
            if (typeof values === "object") {
                throw new Error("Cannot update with object key");
            }
            values = {
                [values]: value,
            };
        }

        return this._connection.update(
            this._grammar.compileUpdate(this, values),
            this._cleanBindings(this._grammar.prepareBindingsForUpdate(this._bindings, values))
        );
    }

    /**
     * Delete a record from the database.
     *
     * @param id
     * @return {Promise<*>}
     */
    delete(id = null) {
        // If an ID is passed to the method, we will set the where clause to check the
        // ID to let developers to simply and quickly remove a single row from this
        // database without manually specifying the "where" clauses on the query.
        if (id) {
            this.where(this._from + ".id", "=", id);
        }

        return this._connection.delete(
            this._grammar.compileDelete(this),
            this._cleanBindings(this._grammar.prepareBindingsForDelete(this._bindings))
        );
    }

    /////////////

    /**
     * Prepare the value and operator for a where clause.
     *
     * @param value
     * @param operator
     * @param useDefault
     * @returns {*[]}
     * @private
     */
    _prepareValueAndOperator(value, operator, useDefault = false) {
        if (useDefault) {
            return [operator, "="];
        }

        if (this._invalidOperatorAndValue(operator, value)) {
            throw new Error("Illegal operator and value combination.");
        }

        return [value, operator];
    }

    /**
     * Determine if the given operator and value combination is legal.
     * Prevents using Null values with invalid operators.
     *
     * @param operator
     * @param value
     * @returns {boolean}
     * @private
     */
    _invalidOperatorAndValue(operator, value) {
        return value === null && this._operators.includes(operator) && !["=", "<>", "!="].includes(operator);
    }

    /**
     * Determine if the given operator is supported.
     *
     * @param operator
     * @returns {boolean|*}
     */
    _invalidOperator(operator) {
        return !this._operators.includes(operator.toLowerCase());
    }

    /**
     * Add a binding to the query.
     *
     * @param value
     * @param type
     * @returns {Builder}
     * @private
     */
    _addBinding(value, type = "where") {
        if (!Object.keys(this._bindings).includes(type)) {
            throw new Error(`Invalid binding type: ${type}."`);
        }

        if (Array.isArray(value)) {
            this._bindings[type] = this._bindings[type].concat(value);
        } else {
            this._bindings[type].push(value);
        }

        return this;
    }

    /**
     * Get the current query value bindings in a flattened array.
     *
     * @return {Array}
     * @private
     */
    _getBindings() {
        return Arr.flatten(this._bindings);
    }

    /**
     * Run the query as a "select" statement against the connection.
     *
     * @return {Promise<*>}
     * @private
     */
    _runSelect() {
        const sql = this.toSql();
        return this._connection.select(sql, this._getBindings());
    }

    /**
     * @return {Builder}
     * @private
     */
    _resetColumns() {
        this.columns(null);
        return this;
    }

    /**
     * Remove query given bindings.
     *
     * @param properties
     * @return {Builder}
     * @private
     */
    _resetBindings(properties) {
        properties.forEach(property => {
            this._bindings[property] = [];
        });

        return this;
    }

    /**
     * Clone the query without the given bindings.
     *
     * @param func
     * @param columns
     * @returns {Builder}
     */
    _setAggregate(func, columns) {
        this._aggregate = { function: func, columns };

        if (!this._groups) {
            this._orders = null;
            this._bindings.order = [];
        }

        return this;
    }

    /**
     * @param bindings
     * @private
     */
    _cleanBindings(bindings) {
        return Object.keys(bindings)
            .filter(key => !(bindings[key] instanceof Expression))
            .map(key => bindings[key]);
    }
}
