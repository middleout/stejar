"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connection = void 0;

var _raw2 = require("./Helpers/raw");

var _Builder = require("./Query/Builder");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Connection =
/*#__PURE__*/
function () {
  /**
   * @param adapter
   */
  function Connection(adapter) {
    _classCallCheck(this, Connection);

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


  _createClass(Connection, [{
    key: "table",
    value: function table(_table) {
      return this.query().from(_table);
    }
    /**
     * Enable the query log on the connection.
     */

  }, {
    key: "enableQueryLog",
    value: function enableQueryLog() {
      this._loggingQueries = true;
    }
    /**
     * Disable the query log on the connection.
     */

  }, {
    key: "disableQueryLog",
    value: function disableQueryLog() {
      this._loggingQueries = false;
    }
    /**
     * Determine whether we're logging queries.
     *
     * @return {boolean}
     */

  }, {
    key: "logging",
    value: function logging() {
      return this._loggingQueries;
    }
    /**
     * Get the table prefix for the connection.
     *
     * @return {string}
     */

  }, {
    key: "getTablePrefix",
    value: function getTablePrefix() {
      return this._tablePrefix;
    }
    /**
     * Set the table prefix in use by the connection.
     *
     * @param prefix
     */

  }, {
    key: "setTablePrefix",
    value: function setTablePrefix(prefix) {
      this._tablePrefix = prefix;

      this._getQueryGrammar().setTablePrefix(prefix);
    }
    /**
     * Set the table prefix and return the grammar.
     *
     * @param grammar : Grammar
     * @return {*}
     */

  }, {
    key: "withTablePrefix",
    value: function withTablePrefix(grammar) {
      grammar.setTablePrefix(this._tablePrefix);
      return grammar;
    }
    /**
     * Get the connection query log.
     *
     * @return {Array}
     */

  }, {
    key: "getQueryLog",
    value: function getQueryLog() {
      return this._queryLog;
    }
    /**
     * Clear the query log.
     */

  }, {
    key: "flushQueryLog",
    value: function flushQueryLog() {
      this._queryLog = [];
    }
    /**
     * @param value
     * @return {*}
     */

  }, {
    key: "raw",
    value: function raw(value) {
      return (0, _raw2.raw)(value);
    }
    /**
     * @param query
     * @param bindings
     * @return {Promise<any>}
     */

  }, {
    key: "rawQuery",
    value: function rawQuery(query, bindings) {
      var _this = this;

      return this._run(query, bindings, function (query, bindings) {
        return _this._adapter.execute(query, bindings);
      });
    }
    /**
     * Get a new query builder instance.
     *
     * @return Builder
     */

  }, {
    key: "query",
    value: function query() {
      return new _Builder.Builder(this, this._getQueryGrammar());
    }
    /**
     * @param query
     * @param bindings
     * @return {Promise<any>}
     */

  }, {
    key: "select",
    value: function select(query, bindings) {
      var _this2 = this;

      return this._run(query, bindings, function (query, bindings) {
        return _this2._adapter.execute(query, bindings);
      });
    }
    /**
     * @param query
     * @param bindings
     * @return {Promise<*>}
     */

  }, {
    key: "insert",
    value: function insert(query, bindings) {
      var _this3 = this;

      return this._run(query, bindings, function (query, bindings) {
        return _this3._adapter.execute(query, bindings);
      }).then(function (r) {
        return r.insertId;
      } // TODO
      );
    }
    /**
     * @param query
     * @param bindings
     * @return {Promise<boolean>}
     */

  }, {
    key: "update",
    value: function update(query, bindings) {
      var _this4 = this;

      return this._run(query, bindings, function (query, bindings) {
        return _this4._adapter.execute(query, bindings);
      }).then(function (r) {
        return r.affectedRows > 0 ? true : false;
      } // TODO
      );
    }
    /**
     * @param query
     * @param bindings
     * @return {Promise<*>}
     */

  }, {
    key: "delete",
    value: function _delete(query, bindings) {
      var _this5 = this;

      return this._run(query, bindings, function (query, bindings) {
        return _this5._adapter.execute(query, bindings);
      }).then(function (r) {
        return r.affectedRows > 0 ? true : false;
      } // TODO
      );
    }
    /**
     * @return {Promise<void>}
     */

  }, {
    key: "beginTransaction",
    value: function beginTransaction() {
      var _this6 = this;

      this._transactionLevel++;

      if (this._transactionLevel > 1) {
        return Promise.resolve();
      }

      return this._run("START TRANSACTION", {}, function (query, bindings) {
        return _this6._adapter.query(query, bindings);
      }).then(function () {
        return true;
      });
    }
    /**
     * @return {Promise<void>}
     */

  }, {
    key: "commitTransaction",
    value: function commitTransaction() {
      var _this7 = this;

      this._transactionLevel--;

      if (this._transactionLevel > 0) {
        return Promise.resolve();
      }

      return this._run("COMMIT", {}, function (query, bindings) {
        return _this7._adapter.query(query, bindings);
      }).then(function () {
        return true;
      });
    }
    /**
     * @return {Promise<void>}
     */

  }, {
    key: "rollbackTransaction",
    value: function rollbackTransaction() {
      var _this8 = this;

      this._transactionLevel = 0;
      return this._run("ROLLBACK", {}, function (query, bindings) {
        return _this8._adapter.query(query, bindings);
      }).then(function () {
        return true;
      });
    }
    /**
     * @param callback : Function
     * @return {Promise<void>}
     */

  }, {
    key: "transaction",
    value: function transaction(callback) {
      var _this9 = this;

      return this.beginTransaction().then(function () {
        return callback();
      }).then(function (result) {
        return _this9.commitTransaction().then(function () {
          return result;
        });
      }).catch(function (error) {
        return _this9.rollbackTransaction().then(function () {
          throw error;
        });
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
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

  }, {
    key: "_run",
    value: function _run(query, bindings, callback) {
      var _this10 = this;

      var start = Date.now() % 1000 / 1000;
      return callback(query, bindings).then(function (result) {
        _this10._logQuery(query, bindings, _this10._getElapsedTime(start));

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

  }, {
    key: "_logQuery",
    value: function _logQuery(query, bindings) {
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (this._loggingQueries) {
        this._queryLog.push({
          query: query,
          bindings: bindings,
          time: time
        });
      }
    }
    /**
     * @param start
     * @return {number}
     * @private
     */

  }, {
    key: "_getElapsedTime",
    value: function _getElapsedTime(start) {
      return Math.round((Date.now() % 1000 / 1000 - start) * 100);
    }
    /**
     * @return {Grammar}
     */

  }, {
    key: "_getQueryGrammar",
    value: function _getQueryGrammar() {
      return this._adapter.getGrammar();
    }
  }]);

  return Connection;
}();

exports.Connection = Connection;