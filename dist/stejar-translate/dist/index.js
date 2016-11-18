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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.TranslatorService = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _di = __webpack_require__(7);

var _moment = __webpack_require__(10);

var _moment2 = _interopRequireDefault(_moment);

var _numbro = __webpack_require__(11);

var _numbro2 = _interopRequireDefault(_numbro);

var _utils = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TranslatorService = function () {
    /**
     * @param adapter
     */
    function TranslatorService(adapter) {
        _classCallCheck(this, TranslatorService);

        this.adapter = adapter;
        /**
         * @type {Array}
         */
        this.loadedLocales = [];
        /**
         * @type {any}
         */
        this.activeLocale = null;
        /**
         * @type {boolean}
         */
        this.debug = false;
        /**
         * @type {{}}
         */
        this.catalogs = {};
        /**
         * @type {Subject}
         */
        this._activeLocale$ = new _utils.Subject(null);
        /**
         * @type {Subject}
         */
        this._loadedLocales$ = new _utils.Subject([]);
        /**
         * @type {Observable}
         */
        this.activeLocale$ = this._activeLocale$.asObservable();
        /**
         * @type {Observable}
         */
        this.loadedLocales$ = this._loadedLocales$.asObservable();
    }
    /**
     * @returns {void}
     */


    TranslatorService.prototype.enableDebug = function enableDebug() {
        this.debug = true;
        console.log('[Stejar-Translate][TranslatorService] - Debug enabled');
    };
    /**
     * @returns {void}
     */


    TranslatorService.prototype.disableDebug = function disableDebug() {
        this.debug = false;
    };
    /**
     * @param localeCode
     * @returns {boolean}
     */


    TranslatorService.prototype.isLocaleLoaded = function isLocaleLoaded(localeCode) {
        return this.loadedLocales.indexOf(localeCode) !== -1;
    };
    /**
     * @param localeCode
     * @param config
     * @returns {TranslatorService}
     */


    TranslatorService.prototype.registerNumbersLocale = function registerNumbersLocale(localeCode, config) {
        _numbro2.default.language(localeCode, config);
        if (this.debug) {
            console.log("[Stejar-Translate][TranslatorService] - Registered Numbers Locale: " + localeCode);
        }
        return this;
    };
    /**
     * @param localeCode
     * @param config
     * @returns {TranslatorService}
     */


    TranslatorService.prototype.registerDateLocale = function registerDateLocale(localeCode, config) {
        _moment2.default.locale(localeCode, config);
        if (this.debug) {
            console.log("[Stejar-Translate][TranslatorService] - Registered Date Locale: " + localeCode);
        }
        return this;
    };
    /**
     * @param localeCode
     */


    TranslatorService.prototype.changeLocale = function changeLocale(localeCode) {
        if (!this.isLocaleLoaded(localeCode)) {
            throw new Error("Locale \"" + localeCode + "\" has not been loaded");
        }
        this.activeLocale = localeCode;
        var momentLocale = localeCode.split('-')[0];
        _moment2.default.locale(momentLocale);
        _numbro2.default.culture(localeCode);
        if (this.debug) {
            console.log("[Stejar-Translate][TranslatorService] - Changed locale to " + localeCode);
        }
        this._activeLocale$.emit(localeCode);
    };
    /**
     * @returns {string}
     */


    TranslatorService.prototype.getCurrentLocale = function getCurrentLocale() {
        return this.activeLocale;
    };
    /**
     * @param localeCode
     * @returns {Promise<TResult>}
     */


    TranslatorService.prototype.loadLocale = function loadLocale(localeCode) {
        var _this = this;

        return this.adapter.load(localeCode).then(function (catalog) {
            _this.catalogs[localeCode] = catalog;
            if (!_this.isLocaleLoaded(localeCode)) {
                _this.loadedLocales.push(localeCode);
            }
            if (_this.debug) {
                console.log("[Stejar-Translate][TranslatorService] - Loaded locale: " + localeCode);
            }
            _this._loadedLocales$.emit(_this.loadedLocales);
        });
    };
    /**
     * @param label
     * @returns {string}
     */


    TranslatorService.prototype.translate = function translate(label) {
        if (!this.activeLocale) {
            throw new Error("[Stejar-Translate][TranslatorService] There is no active locale to fallback to.");
        }
        var locale = this.activeLocale;
        var catalog = this.catalogs[locale];
        if (!catalog[label]) {
            if (this.debug) {
                console.warn("[Stejar-Translate][TranslatorService] Label \"" + label + "\" does not exist");
            }
            return label;
        }
        return catalog[label];
    };

    return TranslatorService;
}();
exports.TranslatorService = TranslatorService = __decorate([_di.injectable, __metadata("design:paramtypes", [Object])], TranslatorService);
exports.TranslatorService = TranslatorService;

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("@stejar/react");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("@stejar/react-di");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _index = __webpack_require__(6);

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.LocalizedTitle = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactHelmet = __webpack_require__(12);

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _react = __webpack_require__(1);

var _reactDi = __webpack_require__(2);

var _TranslatorService = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LocalizedTitle = function (_PureComponent) {
    _inherits(LocalizedTitle, _PureComponent);

    function LocalizedTitle() {
        _classCallCheck(this, LocalizedTitle);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    /**
     * @returns {JSX.Element}
     */
    LocalizedTitle.prototype.render = function render() {
        var params = Object.assign({}, this.props);
        delete params.children;
        var translatedValue = this.props.translatorService.translate(this.props.children);
        Object.keys(params).forEach(function (name) {
            translatedValue = translatedValue.replace("%(" + name + ")", params[name]);
        });
        return React.createElement(_reactHelmet2.default, { title: translatedValue });
    };

    return LocalizedTitle;
}(_react.PureComponent);
exports.LocalizedTitle = LocalizedTitle = __decorate([(0, _reactDi.inject)({
    translatorService: _TranslatorService.TranslatorService
}), __metadata("design:paramtypes", [])], LocalizedTitle);
exports.LocalizedTitle = LocalizedTitle;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.Translate = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = __webpack_require__(9);

var _react = __webpack_require__(1);

var _reactDi = __webpack_require__(2);

var _TranslatorService = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Translate = function (_PureComponent) {
    _inherits(Translate, _PureComponent);

    function Translate() {
        _classCallCheck(this, Translate);

        /**
         * @type {Function}
         */
        var _this = _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));

        _this.unsubscribe = function () {
            return null;
        };
        return _this;
    }
    /**
     * @returns {JSX.Element}
     */


    Translate.prototype.render = function render() {
        var params = Object.assign({}, this.props);
        delete params.children;
        delete params.translatorService;
        var translatedValue = this.props.translatorService.translate(this.props.children);
        var list = [];
        Object.keys(params).forEach(function (name) {
            if ((0, _lodash.isObject)(params[name])) {
                list.push(params[name]);
                translatedValue = translatedValue.replace("%(" + name + ")", '{REACT}');
            } else {
                translatedValue = translatedValue.replace("%(" + name + ")", params[name]);
            }
        });
        if (Object.keys(list).length > 0) {
            var _ret = function () {
                var result = translatedValue.split('{REACT}');
                var newResult = [];
                var offset = 0;
                result.forEach(function (item) {
                    offset++;
                    newResult.push(React.createElement("span", { dangerouslySetInnerHTML: { __html: item }, key: offset }));
                    if (list.length > 0) {
                        offset++;
                        newResult.push(React.createElement("span", { dangerouslySetInnerHTML: { __html: list.shift() }, key: offset }));
                    }
                });
                return {
                    v: React.createElement(
                        "span",
                        null,
                        [null].concat(newResult)
                    )
                };
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
        if (-1 !== translatedValue.indexOf('&') || -1 !== translatedValue.indexOf('<') && -1 !== translatedValue.indexOf('>')) {
            return React.createElement("span", { dangerouslySetInnerHTML: { __html: translatedValue } });
        }
        return React.createElement(
            "span",
            null,
            translatedValue
        );
    };
    /**
     * @returns {null}
     */


    Translate.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        this.unsubscribe = this.props.translatorService.activeLocale$.subscribe(function (locale) {
            return _this2.setState({ locale: locale });
        });
        return null;
    };
    /**
     * @returns {null}
     */


    Translate.prototype.componentWillUnmount = function componentWillUnmount() {
        this.unsubscribe();
        return null;
    };

    return Translate;
}(_react.PureComponent);
exports.Translate = Translate = __decorate([(0, _reactDi.inject)({
    translatorService: _TranslatorService.TranslatorService
}), __metadata("design:paramtypes", [])], Translate);
exports.Translate = Translate;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _TranslatorService = __webpack_require__(0);

Object.keys(_TranslatorService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TranslatorService[key];
    }
  });
});

var _Translate = __webpack_require__(5);

Object.keys(_Translate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Translate[key];
    }
  });
});

var _LocalizedTitle = __webpack_require__(4);

Object.keys(_LocalizedTitle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LocalizedTitle[key];
    }
  });
});

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("@stejar/di");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("@stejar/utils");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("lodash");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("moment");

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("numbro");

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("react-helmet");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }
/******/ ]);