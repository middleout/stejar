import { Grammar as BaseGrammar } from "../../Grammar/Grammar";
import { Arr } from "../../Helpers/Arr";

export class Grammar extends BaseGrammar {
    constructor() {
        super();
        this._selectComponents = [
            "aggregate",
            "columns",
            "from",
            "joins",
            "wheres",
            "groups",
            "havings",
            "orders",
            "limit",
            "offset",
            "unions",
            "lock",
        ];
    }

    /**
     * @param queryBuilder : Builder
     * @return string
     */
    compileSelect(queryBuilder) {
        // If the query does not have any columns set, we'll set the columns to the
        // * character to just get all of the columns from the database. Then we
        // can build the query and concatenate all the pieces together as one.

        const original = queryBuilder.getColumns();

        if (null === original) {
            queryBuilder.columns(["*"]);
        }

        // To compile the query, we'll spin through each component of the query and
        // see if that component exists. If it does we'll just call the compiler
        // function for the component which is responsible for making the SQL.
        const compiled = Object.values(this.compileComponents(queryBuilder)).filter(i => !!i);
        const sql = this._concatenate(compiled).trim();

        queryBuilder.columns(original);

        return sql;
    }

    /**
     * @param query : Builder
     * @param values : Array
     * @returns {string}
     */
    compileInsert(query, values) {
        // Essentially we will force every insert to be treated as a batch insert which
        // simply makes creating the SQL easier for us since we can utilize the same
        // basic routine regardless of an amount of records given to us to insert.
        const table = this._wrapTable(query.getFrom());

        if (!Array.isArray(values)) {
            values = [values];
        }
        const columns = this.columnize(Object.keys(values[0]));

        const parameters = values.map(record => "(" + this.parameterize(Object.values(record)) + ")").join(", ");

        return `insert into ${table} (${columns}) values ${parameters}`;
    }

    /**
     * Compile an update statement into SQL.
     *
     * @param query : Builder
     * @param values : Array
     * @returns {string}
     */
    compileUpdate(query, values) {
        const table = this._wrapTable(query.getFrom());

        // Each one of the columns in the update statements needs to be wrapped in the
        // keyword identifiers, also a place-holder needs to be created for each of
        // the values in the list of bindings so we can make the sets statements.
        const columns = Object.keys(values)
            .map(key => this.wrap(key) + " = " + this.parameter(values[key]))
            .join(", ");

        const joins = "";

        // TODO
        // if (query.getJoins()) {}

        // Of course, update queries may also be constrained by where clauses so we'll
        // need to compile the where clauses and attach it to the query so only the
        // intended records are updated by the SQL statements we generate to run.
        const wheres = this._compileWheres(query);

        return `update ${table}${joins} set ${columns} ${wheres}`.trim();
    }

    /**
     * @param query : Builder
     * @return {string}
     */
    compileDelete(query) {
        const wheres = Array.isArray(query.getWheres()) ? this._compileWheres(query) : "";

        return `delete from ${this._wrapTable(query.getFrom())} ${wheres}`.trim();
    }

    /**
     * @param bindings
     * @param values
     * @return {*}
     */
    prepareBindingsForUpdate(bindings, values) {
        const cleanBindings = {};
        Object.keys(bindings).forEach(key => {
            if (!["join", "select"].includes(key)) {
                cleanBindings[key] = bindings[key];
            }
        });

        return bindings.join.concat(Object.values(values), Arr.flatten(cleanBindings));
    }

    /**
     * @param bindings
     * @return {*}
     */
    prepareBindingsForDelete(bindings) {
        return Arr.flatten(bindings);
    }

    /**
     * @param queryBuilder : Builder
     * @return *
     */
    compileComponents(queryBuilder) {
        const sql = {};

        this._selectComponents.forEach(component => {
            switch (component) {
                case "aggregate":
                    if (null !== queryBuilder.getAggregate()) {
                        sql[component] = this._compileAggregate(queryBuilder, queryBuilder.getAggregate());
                    }
                    break;
                case "columns":
                    if (null !== queryBuilder.getColumns()) {
                        sql[component] = this._compileColumns(queryBuilder, queryBuilder.getColumns());
                    }
                    break;
                case "from":
                    if (null !== queryBuilder.getFrom()) {
                        sql[component] = this._compileFrom(queryBuilder, queryBuilder.getFrom());
                    }
                    break;
                case "wheres":
                    if (null !== queryBuilder.getWheres()) {
                        sql[component] = this._compileWheres(queryBuilder);
                    }
                    break;
                case "orders":
                    if (null !== queryBuilder.getOrders()) {
                        sql[component] = this._compileOrders(queryBuilder, queryBuilder.getOrders());
                    }
                    break;
                case "offset":
                    if (null !== queryBuilder.getOffset()) {
                        sql[component] = this._compileOffset(queryBuilder, queryBuilder.getOffset());
                    }
                    break;
                case "limit":
                    if (null !== queryBuilder.getLimit()) {
                        sql[component] = this._compileLimit(queryBuilder, queryBuilder.getLimit());
                    }
                    break;
            }
        });

        return sql;
    }

    /**
     * @param query : Builder
     * @param aggregate : *
     * @return string
     */
    _compileAggregate(query, aggregate) {
        let column = this.columnize(aggregate.columns);

        // If the query has a "distinct" constraint and we're not asking for all columns
        // we need to prepend "distinct" onto the column name so that the query takes
        // it into account when it performs the aggregating operations on the data.
        if (query.getDistinct() && column !== "*") {
            column = "distinct " + column;
        }

        return "select " + aggregate.function + "(" + column + ") as aggregate";
    }

    /**
     * Compile the "select *" portion of the query.
     *
     * @param query : Builder
     * @param columns : Array<string|Expression>
     * @return string|undefined
     */
    _compileColumns(query, columns) {
        // If the query is actually performing an aggregating select, we will let that
        // compiler handle the building of the select clauses, as it will need some
        // more syntax that is best handled by that function to keep things neat.
        if (null !== query.getAggregate()) {
            return;
        }

        const select = query.getDistinct() ? "select distinct " : "select ";
        return select + this.columnize(columns);
    }

    /**
     * Compile the "from" portion of the query.
     *
     * @param query : Builder
     * @param table : string
     * @return string
     */
    _compileFrom(query, table) {
        return "from " + this._wrapTable(table);
    }

    /**
     * Compile the "where" portions of the query.
     *
     * @param query : Builder
     * @return string
     * @private
     */
    _compileWheres(query) {
        // Each type of where clauses has its own compiler function which is responsible
        // for actually creating the where clauses SQL. This helps keep the code nice
        // and maintainable since each clause has a very small method that it uses.
        if (!query.getWheres()) {
            return "";
        }

        // If we actually have some where clauses, we will strip off the first boolean
        // operator, which is added by the query builders for convenience so we can
        // avoid checking for the first clauses in each of the compilers methods.
        const sql = this._compileWheresToArray(query);
        if (sql.length > 0) {
            return this._concatenateWhereClauses(query, sql);
        }

        return "";
    }

    /**
     * Get an array of all the where clauses for the query.
     *
     * @param query : Builder
     * @return {Array<*>}
     * @private
     */
    _compileWheresToArray(query) {
        return query.getWheres().map(where => {
            let result;
            switch (where.type) {
                case "Basic":
                    result = this._whereBasic(query, where);
                    break;
                case "In":
                    result = this._whereIn(query, where);
                    break;
                case "NotIn":
                    result = this._whereNotIn(query, where);
                    break;
                case "Null":
                    result = this._whereNull(query, where);
                    break;
                case "NotNull":
                    result = this._whereNotNull(query, where);
                    break;
                case "Exists":
                    result = this._whereExists(query, where);
                    break;
                case "NotExists":
                    result = this._whereNotExists(query, where);
                    break;
            }

            return where.boolean + " " + result;
        });
    }

    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereBasic(query, where) {
        const value = this.parameter(where.value);

        return this.wrap(where.column) + " " + where.operator + " " + value;
    }

    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereIn(query, where) {
        if (where.values) {
            return this.wrap(where.column) + " in (" + this.parameterize(where.values) + ")";
        }

        return "0 = 1";
    }

    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereNotIn(query, where) {
        if (where.values) {
            return this.wrap(where.column) + " not in (" + this.parameterize(where.values) + ")";
        }

        return "1 = 1";
    }

    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereNull(query, where) {
        return this.wrap(where.column) + " is null";
    }

    /**
     * Compile a where exists clause.
     *
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereExists(query, where) {
        return "exists (" + this.compileSelect(where.query) + ")";
    }

    /**
     * Compile a where not exists clause.
     *
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereNotExists(query, where) {
        return "not exists (" + this.compileSelect(where.query) + ")";
    }

    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */
    _whereNotNull(query, where) {
        return this.wrap(where.column) + " is not null";
    }

    /**
     * Concatenate an array of segments, removing empties.
     *
     * @param segments : Array<string>
     * @returns {string}
     * @private
     */
    _concatenate(segments) {
        return segments.filter(item => item.toString() !== "").join(" ");
    }

    /**
     * @param query : Builder
     * @param sql : *
     * @return {string}
     * @private
     */
    _concatenateWhereClauses(query, sql) {
        // TODO
        // const conjunction = query instanceof JoinClause ? 'on' : 'where';
        const conjuction = "where";

        return conjuction + " " + this._removeLeadingBoolean(sql.join(" "));
    }

    /**
     * @param value : string
     * @return {string}
     * @private
     */
    _removeLeadingBoolean(value) {
        return value.replace(/and |or /i, "");
    }

    /**
     * @param query : Builder
     * @param orders : *
     * @return {string}
     * @private
     */
    _compileOrders(query, orders) {
        if (!orders) {
            return "";
        }

        return "order by " + this._compileOrdersToArray(query, orders).join(", ");
    }

    /**
     * Compile the "offset" portions of the query.
     *
     * @param query : Builder
     * @param offset : *
     * @return {string}
     * @private
     */
    _compileOffset(query, offset) {
        return "offset " + parseInt(offset);
    }

    /**
     * Compile the "limit" portions of the query.
     *
     * @param query : Builder
     * @param limit : *
     * @return {string}
     * @private
     */
    _compileLimit(query, limit) {
        return "limit " + parseInt(limit);
    }

    /**
     * @param seed : string
     * @return {string}
     *
     */
    // eslint-disable-next-line
    compileRandom(seed) {
        return "RANDOM()";
    }

    /**
     * @param query : Builder
     * @param orders : *
     * @return {Array<string>}
     * @private
     */
    _compileOrdersToArray(query, orders) {
        return orders.map(order => {
            return !order.sql ? this.wrap(order.column) + " " + order.direction : order.sql;
        });
    }
}
