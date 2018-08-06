import { raw } from "./Helpers/raw";
import { Builder } from "./Query/Builder";

export class Connection {
    /**
     * @param adapter
     */
    constructor(adapter) {
        /**
         * @type {MySqlAdapter}
         * @private
         */
        this._adapter = adapter;

        /**
         * @type {boolean}
         * @private
         */
        this._loggingQueries = false;

        /**
         * @type {Array}
         * @private
         */
        this._queryLog = [];

        /**
         * @type {string}
         * @private
         */
        this._tablePrefix = "";

        /**
         * @type {number}
         * @private
         */
        this._transactionLevel = 0;
    }

    /**
     * Begin a fluent query against a database table.
     *
     * @param table
     * @return Builder
     */
    table(table) {
        return this.query().from(table);
    }

    /**
     * Enable the query log on the connection.
     */
    enableQueryLog() {
        this._loggingQueries = true;
    }

    /**
     * Disable the query log on the connection.
     */
    disableQueryLog() {
        this._loggingQueries = false;
    }

    /**
     * Determine whether we're logging queries.
     *
     * @return {boolean}
     */
    logging() {
        return this._loggingQueries;
    }

    /**
     * Get the table prefix for the connection.
     *
     * @return {string}
     */
    getTablePrefix() {
        return this._tablePrefix;
    }

    /**
     * Set the table prefix in use by the connection.
     *
     * @param prefix
     */
    setTablePrefix(prefix) {
        this._tablePrefix = prefix;
        this._getQueryGrammar().setTablePrefix(prefix);
    }

    /**
     * Set the table prefix and return the grammar.
     *
     * @param grammar : Grammar
     * @return {*}
     */
    withTablePrefix(grammar) {
        grammar.setTablePrefix(this._tablePrefix);
        return grammar;
    }

    /**
     * Get the connection query log.
     *
     * @return {Array}
     */
    getQueryLog() {
        return this._queryLog;
    }

    /**
     * Clear the query log.
     */
    flushQueryLog() {
        this._queryLog = [];
    }

    /**
     * @param value
     * @return {*}
     */
    raw(value) {
        return raw(value);
    }

    /**
     * @param query
     * @param bindings
     * @return {Promise<any>}
     */
    rawQuery(query, bindings) {
        return this._run(query, bindings, (query, bindings) => this._adapter.execute(query, bindings));
    }

    /**
     * Get a new query builder instance.
     *
     * @return Builder
     */
    query() {
        return new Builder(this, this._getQueryGrammar());
    }

    /**
     * @param query
     * @param bindings
     * @return {Promise<any>}
     */
    select(query, bindings) {
        return this._run(query, bindings, (query, bindings) => this._adapter.execute(query, bindings));
    }

    /**
     * @param query
     * @param bindings
     * @return {Promise<*>}
     */
    insert(query, bindings) {
        return this._run(query, bindings, (query, bindings) => this._adapter.execute(query, bindings)).then(
            r => r.insertId // TODO
        );
    }

    /**
     * @param query
     * @param bindings
     * @return {Promise<boolean>}
     */
    update(query, bindings) {
        return this._run(query, bindings, (query, bindings) => this._adapter.execute(query, bindings)).then(
            r => (r.affectedRows > 0 ? true : false) // TODO
        );
    }

    /**
     * @param query
     * @param bindings
     * @return {Promise<*>}
     */
    delete(query, bindings) {
        return this._run(query, bindings, (query, bindings) => this._adapter.execute(query, bindings)).then(
            r => (r.affectedRows > 0 ? true : false) // TODO
        );
    }

    /**
     * @return {Promise<void>}
     */
    beginTransaction() {
        this._transactionLevel++;

        if (this._transactionLevel > 1) {
            return Promise.resolve();
        }

        return this._run("START TRANSACTION", {}, (query, bindings) => this._adapter.query(query, bindings)).then(
            () => true
        );
    }

    /**
     * @return {Promise<void>}
     */
    commitTransaction() {
        this._transactionLevel--;

        if (this._transactionLevel > 0) {
            return Promise.resolve();
        }

        return this._run("COMMIT", {}, (query, bindings) => this._adapter.query(query, bindings)).then(() => true);
    }

    /**
     * @return {Promise<void>}
     */
    rollbackTransaction() {
        this._transactionLevel = 0;
        return this._run("ROLLBACK", {}, (query, bindings) => this._adapter.query(query, bindings)).then(() => true);
    }

    /**
     * @param callback : Function
     * @return {Promise<void>}
     */
    transaction(callback) {
        return this.beginTransaction()
            .then(() => callback())
            .then(result => this.commitTransaction().then(() => result))
            .catch(error =>
                this.rollbackTransaction().then(() => {
                    throw error;
                })
            );
    }

    disconnect() {
        return this._adapter.disconnect();
    }

    /**
     * Run a SQL statement and log its execution context.
     *
     * @param query
     * @param bindings
     * @param callback
     * @private
     */
    _run(query, bindings, callback) {
        const start = (Date.now() % 1000) / 1000;

        return callback(query, bindings).then(result => {
            this._logQuery(query, bindings, this._getElapsedTime(start));

            return result;
        });
    }

    /**
     * Log a query in the connection's query log.
     *
     * @param query
     * @param bindings
     * @param time : number|Null
     * @private
     */
    _logQuery(query, bindings, time = null) {
        if (this._loggingQueries) {
            this._queryLog.push({ query, bindings, time });
        }
    }

    /**
     * @param start
     * @return {number}
     * @private
     */
    _getElapsedTime(start) {
        return Math.round(((Date.now() % 1000) / 1000 - start) * 100);
    }

    /**
     * @return {Grammar}
     */
    _getQueryGrammar() {
        return this._adapter.getGrammar();
    }
}
