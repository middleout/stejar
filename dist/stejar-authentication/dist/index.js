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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/***/ function(module, exports) {

"use strict";
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticationService = exports.AuthenticationService = function () {
    /**
     * @param authenticationAdapter
     */
    function AuthenticationService(authenticationAdapter) {
        _classCallCheck(this, AuthenticationService);

        this.authenticationAdapter = authenticationAdapter;
        /**
         * @type {I}
         */
        this.identity = null;
    }
    /**
     * @returns {AuthenticationAdapterContract<I>}
     */


    AuthenticationService.prototype.getAdapter = function getAdapter() {
        return this.authenticationAdapter;
    };
    /**
     * @returns {boolean}
     */


    AuthenticationService.prototype.hasIdentity = function hasIdentity() {
        return !!this.identity;
    };
    /**
     * @returns {I}
     */


    AuthenticationService.prototype.getIdentity = function getIdentity() {
        if (!this.identity) {
            throw new Error('[Stejar.AuthenticationService] There is no identity registered. Do a check with "hasIdentity()" before calling this method.');
        }
        return this.identity;
    };
    /**
     * @returns {string}
     */


    AuthenticationService.prototype.getRole = function getRole() {
        if (!this.identity) {
            throw new Error('[Stejar.AuthenticationService] There is no identity registered. Do a check with "hasIdentity()" before calling this method.');
        }
        return this.authenticationAdapter.getRole(this.identity);
    };
    /**
     * @returns {Promise<boolean>}
     */


    AuthenticationService.prototype.refreshIdentity = function refreshIdentity() {
        var _this = this;

        return this.authenticationAdapter.refreshIdentity().then(function (data) {
            if (!data) {
                throw new Error("[Stejar.AuthenticationService] Could not Refresh Identity");
            }
            _this.identity = data;
            return true;
        });
    };
    /**
     * @param data
     * @returns {Promise<boolean>}
     */


    AuthenticationService.prototype.authenticate = function authenticate(data) {
        var _this2 = this;

        return this.authenticationAdapter.authenticate(data).then(function (identity) {
            _this2.identity = identity;
            return true;
        });
    };
    /**
     * @returns {Promise<boolean>}
     */


    AuthenticationService.prototype.logout = function logout() {
        var _this3 = this;

        return this.authenticationAdapter.logout().then(function (data) {
            if (!data) {
                throw new Error("[Stejar.AuthenticationService] Could not Logout");
            }
            _this3.identity = null;
            return true;
        });
    };

    return AuthenticationService;
}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _AuthenticationService = __webpack_require__(1);

Object.keys(_AuthenticationService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AuthenticationService[key];
    }
  });
});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ]);