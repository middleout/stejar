"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PureBindedComponent = void 0;

var _react = require("react");

var _binder = require("./binder");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var PureBindedComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(PureBindedComponent, _PureComponent);

  /**
   * @param props
   * @param context
   */
  function PureBindedComponent(props, context) {
    var _this;

    _classCallCheck(this, PureBindedComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PureBindedComponent).call(this, props, context));
    (0, _binder.binder)(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  return PureBindedComponent;
}(_react.PureComponent);

exports.PureBindedComponent = PureBindedComponent;