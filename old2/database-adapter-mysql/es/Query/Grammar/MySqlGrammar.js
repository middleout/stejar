"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MySqlGrammar = void 0;

var _database = require("@stejar/database");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MySqlGrammar =
/*#__PURE__*/
function (_Grammar) {
  _inherits(MySqlGrammar, _Grammar);

  function MySqlGrammar() {
    _classCallCheck(this, MySqlGrammar);

    return _possibleConstructorReturn(this, _getPrototypeOf(MySqlGrammar).apply(this, arguments));
  }

  _createClass(MySqlGrammar, [{
    key: "compileSelect",

    /**
     * @param query : Builder
     * @returns {string}
     */
    value: function compileSelect(query) {
      var sql = _get(_getPrototypeOf(MySqlGrammar.prototype), "compileSelect", this).call(this, query); // TODO
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

  }, {
    key: "compileUpdate",
    value: function compileUpdate(query, values) {
      var table = this._wrapTable(query.getFrom()); // Each one of the columns in the update statements needs to be wrapped in the
      // keyword identifiers, also a place-holder needs to be created for each of
      // the values in the list of bindings so we can make the sets statements.


      var columns = this._compileUpdateColumns(values);

      var joins = ""; // TODO
      // if (query.getJoins()) {
      //
      // }

      var where = this._compileWheres(query);

      var sql = "update ".concat(table).concat(joins, " set ").concat(columns, " ").concat(where).trim();

      if (query.getOrders()) {
        sql += this._compileOrders(query, query.getOrders());
      }

      if (query.getLimit()) {
        sql += " " + this._compileLimit(query, query.getLimit());
      }

      return sql.trim();
    }
    /**
     * @param query
     * @return {string}
     */

  }, {
    key: "compileDelete",
    value: function compileDelete(query) {
      var table = this._wrapTable(query.getFrom());

      var where = Array.isArray(query.getWheres()) ? this._compileWheres(query) : "";
      return this._compileDeleteWithoutJoins(query, table, where);
    }
    /**
     * @param seed : string
     * @return {string}
     */

  }, {
    key: "compileRandom",
    value: function compileRandom(seed) {
      return "RAND(" + seed + ")";
    }
    /**
     * @param bindings
     * @param values
     * @return {*}
     */

  }, {
    key: "prepareBindingsForUpdate",
    value: function prepareBindingsForUpdate(bindings, values) {
      var cleanBindings = Object.keys(bindings).filter(function (key) {
        return !["join", "select"].includes(key);
      }).map(function (key) {
        return bindings[key];
      });
      return bindings.join.concat(Object.values(values)).concat(_database.Arr.flatten(cleanBindings));
    }
    /**
     * @param values
     * @return {string}
     * @private
     */

  }, {
    key: "_compileUpdateColumns",
    value: function _compileUpdateColumns(values) {
      var _this = this;

      return Object.keys(values).map(function (key) {
        return _this.wrap(key) + " = " + _this.parameter(values[key]);
      }).join(", ");
    }
    /***
     * Wrap a single string in keyword identifiers.
     *
     * @param value
     * @return {*}
     * @private
     */

  }, {
    key: "_wrapValue",
    value: function _wrapValue(value) {
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

  }, {
    key: "_compileDeleteWithoutJoins",
    value: function _compileDeleteWithoutJoins(query, table, where) {
      var sql = "delete from ".concat(table, " ").concat(where).trim(); // When using MySQL, delete statements may contain order by statements and limits
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
  }]);

  return MySqlGrammar;
}(_database.Grammar);

exports.MySqlGrammar = MySqlGrammar;