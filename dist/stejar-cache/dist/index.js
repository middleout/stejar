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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _index = __webpack_require__(2);

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
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.CacheService = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _store = __webpack_require__(6);

var _store2 = _interopRequireDefault(_store);

var _moment = __webpack_require__(5);

var _moment2 = _interopRequireDefault(_moment);

var _lodash = __webpack_require__(4);

var _di = __webpack_require__(3);

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

var CacheService = function () {
    /**
     * @param store
     */
    function CacheService() {
        var storeInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _store2.default;

        _classCallCheck(this, CacheService);

        this.storeInstance = storeInstance;
        /**
         * @type {boolean}
         */
        this.debug = false;
        /**
         * @type {boolean}
         */
        this.enabled = false;
    }
    /**
     * @returns {boolean}
     */


    CacheService.prototype.canCache = function canCache() {
        return this.storeInstance.enabled && this.enabled;
    };
    /**
     * @param args
     */


    CacheService.prototype.log = function log() {
        if (!this.debug) {
            return;
        }

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        args.forEach(function (arg) {
            return console.log(arg);
        });
    };
    /**
     * @param signature
     * @returns {any|null}
     */


    CacheService.prototype.get = function get(signature) {
        if (!this.canCache()) {
            return;
        }
        this.log('Trying to get item ' + signature);
        var value = this.storeInstance.get(signature);
        if (!value || this.isExpired(value)) {
            this.log('No data found or expired for  ' + signature);
            return null;
        }
        this.log('Got data from cache for  ' + signature, JSON.parse(value.value));
        return JSON.parse(value.value);
    };
    /**
     * @returns {void}
     */


    CacheService.prototype.clear = function clear() {
        this.log('Cache cleared');
        this.storeInstance.clear();
    };
    /**
     * @returns {boolean}
     */


    CacheService.prototype.debugEnabled = function debugEnabled() {
        return this.debug;
    };
    /**
     * @param tag
     * @returns {Array}
     */


    CacheService.prototype.getByTag = function getByTag(tag) {
        var _this = this;

        this.log('Get item by tag: ' + tag);
        var items = [];
        (0, _lodash.each)(this.storeInstance.getAll(), function (item) {
            if (-1 !== item.tags.indexOf(tag)) {
                if (!_this.isExpired(item)) {
                    items.push(JSON.parse(item.value));
                }
            }
        });
        this.log('Got items by tag: ' + tag, items);
        return items;
    };
    /**
     * @param tag
     */


    CacheService.prototype.clearByTag = function clearByTag(tag) {
        var _this2 = this;

        this.log('Clear items by tag: ' + tag);
        (0, _lodash.each)(this.storeInstance.getAll(), function (item, offset) {
            if (-1 !== item.tags.indexOf(tag)) {
                _this2.remove(offset);
            }
        });
        this.log('Cleared items by tag: ' + tag);
    };
    /**
     * @param signature
     */


    CacheService.prototype.remove = function remove(signature) {
        this.log('Removing item ' + signature);
        this.storeInstance.remove(signature);
    };
    /**
     * @param tags
     */


    CacheService.prototype.clearByTags = function clearByTags(tags) {
        var _this3 = this;

        this.log('Clear items by tags: ' + tags.join(', '));
        (0, _lodash.each)(this.storeInstance.getAll(), function (item, offset) {
            (0, _lodash.each)(tags, function (tag) {
                if (-1 !== item.tags.indexOf(tag)) {
                    _this3.remove(offset);
                }
            });
        });
        this.log('Cleared items by tags: ' + tags.join(', '));
    };
    /**
     * @returns {void}
     */


    CacheService.prototype.enableDebug = function enableDebug() {
        this.debug = true;
        this.log('Cache debug enabled');
        if (!this.storeInstance.enabled) {
            this.log('Cache is disabled due to browser');
        } else {
            if (this.enabled) {
                this.log('Cache is enabled');
            } else {
                this.log('Cache is disabled due to settings');
            }
        }
    };
    /**
     * @returns {void}
     */


    CacheService.prototype.disable = function disable() {
        this.enabled = false;
        this.log('Cache is disabled due to settings');
    };
    /**
     * @returns {boolean}
     */


    CacheService.prototype.isEnabled = function isEnabled() {
        return this.enabled;
    };
    /**
     * @returns {void}
     */


    CacheService.prototype.enable = function enable() {
        this.enabled = true;
        this.log('Cache enabled');
    };
    /**
     * @param name
     * @param value
     * @param expiration
     * @param forcedExpiration
     * @param tags
     */


    CacheService.prototype.set = function set(name, value, expiration, forcedExpiration, tags) {
        if (!expiration) {
            expiration = 0;
        }
        if (!forcedExpiration) {
            forcedExpiration = 0;
        }
        if (!this.canCache()) {
            return;
        }
        var expirationDate = expiration ? (0, _moment2.default)().add(expiration, 'seconds') : 0;
        var forcedExpirationDate = forcedExpiration ? (0, _moment2.default)().add(forcedExpiration, 'seconds') : 0;
        this.log('Setting item into cache ' + name + ' with expiration date: ' + (expirationDate ? expirationDate.format('YYYY-MM-DD HH:mm:ss') : 'never') + ' and a forced expiration date: ' + (forcedExpirationDate ? forcedExpirationDate.format('YYYY-MM-DD HH:mm:ss') : 'never'), value);
        var item = {
            name: name,
            value: JSON.stringify(value),
            expiration: expirationDate !== 0 ? expirationDate.unix() : expirationDate,
            forcedExpirationDate: forcedExpirationDate !== 0 ? forcedExpirationDate.unix() : forcedExpirationDate,
            tags: tags ? tags : []
        };
        this.storeInstance.set(name, item);
    };
    /**
     * @param item
     * @returns {boolean}
     */


    CacheService.prototype.isExpired = function isExpired(item) {
        if (item.forcedExpirationDate != 0 && item.forcedExpirationDate < (0, _moment2.default)().unix()) {
            this.log('Item ' + item.name + ' is expired.');
            this.remove(item.name);
            return true;
        }
        if (item.expiration != 0 && item.expiration < (0, _moment2.default)().unix()) {
            this.log('Item ' + item.name + ' is expired but can still use it for now.');
            this.remove(item.name);
        }
        return false;
    };

    return CacheService;
}();
exports.CacheService = CacheService = __decorate([_di.injectable, __metadata("design:paramtypes", [Object])], CacheService);
exports.CacheService = CacheService;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _CacheService = __webpack_require__(1);

Object.keys(_CacheService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _CacheService[key];
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

module.exports = require("lodash");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("moment");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("store");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ]);