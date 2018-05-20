import mysql from "mysql2";
import { MySqlGrammar } from "../Query/Grammar/MySqlGrammar";

export class MySqlAdapter {
    /**
     * @param config
     */
    constructor(config) {
        /**
         * @private
         */
        this._connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            charset: config.charset || "utf8",
            dateStrings: true,
        });

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
        return this._connection;
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
        return new Promise((resolve, reject) => {
            return this.getConnection().execute(sql, bindings, (err, rows) => {
                if (err) {
                    return reject(err);
                }

                return resolve(rows);
            });
        });
    }

    /**
     * Runs a raw query against the database
     *
     * @param sql
     * @param bindings
     * @return {Promise<any>}
     */
    query(sql, bindings) {
        return new Promise((resolve, reject) => {
            return this.getConnection().query(sql, bindings, (err, rows) => {
                if (err) {
                    return reject(err);
                }

                return resolve(rows);
            });
        });
    }

    /**
     * @return {Promise<*>}
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            this._connection.end(err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }
}
