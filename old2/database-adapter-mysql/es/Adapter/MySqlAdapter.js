"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MySqlAdapter = void 0;

var _mysql = _interopRequireDefault(require("mysql2"));

var _MySqlGrammar = require("../Query/Grammar/MySqlGrammar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MySqlAdapter =
/*#__PURE__*/
function () {
  /**
   * @param config
   */
  function MySqlAdapter(config) {
    _classCallCheck(this, MySqlAdapter);

    _defineProperty(this, "_config", void 0);

    _defineProperty(this, "_connection", void 0);

    this._config = config;
    /**
     * @type {MySqlGrammar}
     * @private
     */

    this._grammar = new _MySqlGrammar.MySqlGrammar();
  }
  /**
   * @return {*}
   */


  _createClass(MySqlAdapter, [{
    key: "getConnection",
    value: function getConnection() {
      if (!this._connection) {
        var _this$_config = this._config,
            _this$_config$pool = _this$_config.pool,
            pool = _this$_config$pool === void 0 ? true : _this$_config$pool,
            user = _this$_config.user,
            charset = _this$_config.charset,
            otherConfig = _objectWithoutProperties(_this$_config, ["pool", "user", "charset"]);

        if (!user) {
          throw new Error("Database \"user\" is required");
        }

        if (pool) {
          this._connection = _mysql.default.createPoolPromise(_objectSpread({
            user: user,
            charset: charset || "utf8",
            dateStrings: true
          }, otherConfig)).getConnection();
          return this._connection;
        }
        /**
         * All the actual config is from
         * https://github.com/mysqljs/mysql#connection-options
         *
         * @private
         */


        this._connection = _mysql.default.createConnectionPromise(_objectSpread({
          user: user,
          charset: charset || "utf8",
          dateStrings: true
        }, otherConfig));
        return this._connection;
      }

      return Promise.resolve(this._connection);
    }
    /**
     * @return {MySqlGrammar}
     */

  }, {
    key: "getGrammar",
    value: function getGrammar() {
      return this._grammar;
    }
    /**
     * Run a prepared statement against the database.
     *
     * @param sql
     * @param bindings
     * @return {Promise<any>}
     */

  }, {
    key: "execute",
    value: function execute(sql, bindings) {
      return this.getConnection().then(function (conn) {
        return conn.execute(sql, bindings);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            data = _ref2[0];

        return data;
      });
    }
    /**
     * Runs a raw query against the database
     *
     * @param sql
     * @param bindings
     * @return {Promise<any>}
     */

  }, {
    key: "query",
    value: function query(sql, bindings) {
      return this.getConnection().then(function (conn) {
        return conn.query(sql, bindings);
      }).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            data = _ref4[0];

        return data;
      });
    }
    /**
     * @return {Promise<*>}
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this$_config$pool2 = this._config.pool,
          pool = _this$_config$pool2 === void 0 ? true : _this$_config$pool2;

      if (pool) {
        return this.getConnection().then(function (conn) {
          return conn.release();
        });
      }

      return this.getConnection().then(function (conn) {
        return conn.disconnect();
      });
    }
  }]);

  return MySqlAdapter;
}();

exports.MySqlAdapter = MySqlAdapter;