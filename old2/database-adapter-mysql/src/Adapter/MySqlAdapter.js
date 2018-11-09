import mysql from "mysql2";
import { MySqlGrammar } from "../Query/Grammar/MySqlGrammar";

export class MySqlAdapter {
    _config;

    _connection;

    /**
     * @param config
     */
    constructor(config) {
        this._config = config;

        /**
         * @type {MySqlGrammar}
         * @private
         */
        this._grammar = new MySqlGrammar();
    }

    /**
     * @return {*}
     */
    getConnection() {
        if (!this._connection) {
            const { pool = true, user, charset, ...otherConfig } = this._config;
            if (!user) {
                throw new Error(`Database "user" is required`);
            }

            if (pool) {
                this._connection = mysql
                    .createPoolPromise({
                        user: user,
                        charset: charset || "utf8",
                        dateStrings: true,
                        ...otherConfig,
                    })
                    .getConnection();

                return this._connection;
            }

            /**
             * All the actual config is from
             * https://github.com/mysqljs/mysql#connection-options
             *
             * @private
             */
            this._connection = mysql.createConnectionPromise({
                user: user,
                charset: charset || "utf8",
                dateStrings: true,
                ...otherConfig,
            });

            return this._connection;
        }

        return Promise.resolve(this._connection);
    }

    /**
     * @return {MySqlGrammar}
     */
    getGrammar() {
        return this._grammar;
    }

    /**
     * Run a prepared statement against the database.
     *
     * @param sql
     * @param bindings
     * @return {Promise<any>}
     */
    execute(sql, bindings) {
        return this.getConnection()
            .then(conn => conn.execute(sql, bindings))
            .then(([data]) => data);
    }

    /**
     * Runs a raw query against the database
     *
     * @param sql
     * @param bindings
     * @return {Promise<any>}
     */
    query(sql, bindings) {
        return this.getConnection()
            .then(conn => conn.query(sql, bindings))
            .then(([data]) => data);
    }

    /**
     * @return {Promise<*>}
     */
    disconnect() {
        const { pool = true } = this._config;

        if (pool) {
            return this.getConnection().then(conn => conn.release());
        }

        return this.getConnection().then(conn => conn.disconnect());
    }
}
