module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _src = __webpack_require__(2);

Object.keys(_src).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _src[key];
    }
  });
});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.BrowserApplication = undefined;

var _reactDom = __webpack_require__(7);

var _di = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

__webpack_require__(4);
__webpack_require__(6);
__webpack_require__(5).polyfill();

var injectTapEventPlugin = __webpack_require__(8);
injectTapEventPlugin();
/**
 * @class BrowserApplication
 */

var BrowserApplication = exports.BrowserApplication = function (_ServiceManager) {
  _inherits(BrowserApplication, _ServiceManager);

  function BrowserApplication() {
    _classCallCheck(this, BrowserApplication);

    return _possibleConstructorReturn(this, _ServiceManager.apply(this, arguments));
  }

  /**
   * @param Component
   * @param element
   * @returns {Promise<any>}
   */
  BrowserApplication.prototype.render = function render(Component) {
    var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.getElementById(".root");

    return (0, _reactDom.render)(React.createElement(Component, { serviceManager: this }), element);
  };

  return BrowserApplication;
}(_di.ServiceManager);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _BrowserApplication = __webpack_require__(1);

Object.keys(_BrowserApplication).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _BrowserApplication[key];
    }
  });
});

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("@stejar/di");

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("babel-polyfill");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("es6-promise");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("react");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("react-dom");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("react-tap-event-plugin");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ]);