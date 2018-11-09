"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Arr = void 0;

var _isExpression = require("./isExpression");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Arr =
/*#__PURE__*/
function () {
  function Arr() {
    _classCallCheck(this, Arr);
  }

  _createClass(Arr, null, [{
    key: "flatten",

    /**
     * @param array
     * @param depth
     * @return {*}
     */
    value: function flatten(array) {
      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      if (Array.isArray(array)) {
        return array.map(function (i) {
          return Arr._doFlatten(i, depth);
        }).reduce(function (p, c) {
          return p.concat(c);
        }, []);
      }

      return Arr._doFlatten(array, depth);
    }
    /**
     * @param item
     * @return {boolean}
     * @private
     */

  }, {
    key: "_isObject",
    value: function _isObject(item) {
      return !(0, _isExpression.isExpression)(item) && null !== item && _typeof(item) === "object" && !Array.isArray(item);
    }
    /**
     * @param array
     * @return {Array}
     * @private
     */

  }, {
    key: "_doFlatten",
    value: function _doFlatten(array) {
      var _this = this;

      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      var result = [];
      Object.keys(array).forEach(function (key) {
        var item = array[key];

        if (_this._isObject(item)) {
          item = Object.values(item);
        }

        if (!Array.isArray(item)) {
          result.push(item);
        } else if (depth === 1) {
          result = result.concat(item);
        } else {
          result = result.concat(Arr._doFlatten(item, depth - 1));
        }
      });
      return result;
    }
  }]);

  return Arr;
}();

exports.Arr = Arr;