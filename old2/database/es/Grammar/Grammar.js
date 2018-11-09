"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grammar = void 0;

var _isExpression2 = require("../Helpers/isExpression");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Grammar =
/*#__PURE__*/
function () {
  function Grammar() {
    _classCallCheck(this, Grammar);

    _defineProperty(this, "_tablePrefix", "");
  }

  _createClass(Grammar, [{
    key: "setTablePrefix",

    /**
     * @param prefix
     * @return {Grammar}
     */
    value: function setTablePrefix(prefix) {
      this._tablePrefix = prefix;
      return this;
    }
    /**
     * @param columns : Array<string|*>
     * @return {string}
     */

  }, {
    key: "columnize",
    value: function columnize(columns) {
      var _this = this;

      return columns.map(function (item) {
        return _this.wrap(item);
      }).join(", ");
    }
    /**
     * @param values : Array<string|*>
     * @return {string}
     */

  }, {
    key: "parameterize",
    value: function parameterize(values) {
      var _this2 = this;

      return values.map(function (item) {
        return _this2.parameter(item);
      }).join(", ");
    }
    /**
     * @param value : *|string
     * @return {string}
     */

  }, {
    key: "parameter",
    value: function parameter(value) {
      return (0, _isExpression2.isExpression)(value) ? this.getValue(value) : "?";
    }
    /**
     * Wrap a value in keyword identifiers.
     *
     * @param value : string|*
     * @param prefixAlias : boolean
     * @return {string}
     */

  }, {
    key: "wrap",
    value: function wrap(value) {
      var prefixAlias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if ((0, _isExpression2.isExpression)(value)) {
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

  }, {
    key: "isExpression",
    value: function isExpression(value) {
      return (0, _isExpression2.isExpression)(value);
    }
    /**
     * Get the value of a raw expression.
     *
     * @param expression : *
     * @return {string}
     */

  }, {
    key: "getValue",
    value: function getValue(expression) {
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

  }, {
    key: "_wrapAliasedValue",
    value: function _wrapAliasedValue(value) {
      var prefixAlias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var segments = value.split(/\s+as\s+/i); // If we are wrapping a table we need to prefix the alias with the table prefix
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

  }, {
    key: "_wrapValue",
    value: function _wrapValue(value) {
      if (value !== "*") {
        return '"' + value.replace('"', '""') + '"';
      }

      return value;
    }
    /**
     * Wrap the given value segments.
     *
     * @param segments : Array<string|*>
     * @return {string}
     * @private
     */

  }, {
    key: "_wrapSegments",
    value: function _wrapSegments(segments) {
      var _this3 = this;

      return segments.map(function (segment, key) {
        return key === 0 && segments.length > 1 ? _this3._wrapTable(segment) : _this3._wrapValue(segment);
      }).join(".");
    }
    /**
     * Wrap a table in keyword identifiers.
     *
     * @param table : string|*
     * @return {string}
     * @private
     */

  }, {
    key: "_wrapTable",
    value: function _wrapTable(table) {
      if (!(0, _isExpression2.isExpression)(table)) {
        return this.wrap(this._tablePrefix + table, true);
      }

      return this.getValue(table);
    }
  }]);

  return Grammar;
}();

exports.Grammar = Grammar;