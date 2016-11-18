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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _AuthorizationService = __webpack_require__(3);

	Object.keys(_AuthorizationService).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _AuthorizationService[key];
	    }
	  });
	});

	var _IsAllowed = __webpack_require__(6);

	Object.keys(_IsAllowed).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _IsAllowed[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.AuthorizationService = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _virgenAcl = __webpack_require__(4);

	var _di = __webpack_require__(5);

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

	var AuthorizationService = function () {
	    function AuthorizationService() {
	        _classCallCheck(this, AuthorizationService);

	        /**
	         * @type {"virgen-acl".Acl}
	         */
	        this.guard = new _virgenAcl.Acl();
	    }
	    /**
	     * @param resource
	     * @param parent
	     */


	    AuthorizationService.prototype.addResource = function addResource(resource, parent) {
	        this.guard.addResource(resource, parent);
	        return this;
	    };
	    /**
	     * @param role
	     * @param parent
	     */


	    AuthorizationService.prototype.addRole = function addRole(role, parent) {
	        this.guard.addRole(role, parent);
	        return this;
	    };
	    /**
	     * @param role
	     * @param resource
	     * @param privilege
	     */


	    AuthorizationService.prototype.allow = function allow(role, resource, privilege) {
	        this.guard.allow(role, resource, privilege);
	        return this;
	    };
	    /**
	     * @param role
	     * @param resource
	     * @param privilege
	     */


	    AuthorizationService.prototype.deny = function deny(role, resource, privilege) {
	        this.guard.deny(role, resource, privilege);
	        return this;
	    };
	    /**
	     * @param role
	     * @param resource
	     * @param privilege
	     * @returns {Promise<T>}
	     */


	    AuthorizationService.prototype.isAllowed = function isAllowed(role, resource, privilege) {
	        var _this = this;

	        return new Promise(function (resolve, reject) {
	            _this.guard.query(role, resource, privilege, function (error, isAllowed) {
	                if (!isAllowed) {
	                    return reject(error || "[Stejar.AuthorizationService] \"" + (role || "(no-role)") + "\" not allowed on \"" + (resource || "(no-resource)") + "\" \"" + (privilege || "(no-privilege)") + "\"");
	                }
	                return resolve();
	            });
	        });
	    };

	    return AuthorizationService;
	}();
	exports.AuthorizationService = AuthorizationService = __decorate([_di.injectable, __metadata("design:paramtypes", [])], AuthorizationService);
	exports.AuthorizationService = AuthorizationService;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("virgen-acl");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("@stejar/di");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.IsAllowed = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.disableDebug = disableDebug;

	var _react = __webpack_require__(7);

	var _reactDi = __webpack_require__(8);

	var _authentication = __webpack_require__(9);

	var _AuthorizationService = __webpack_require__(3);

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

	var debug = true;
	function disableDebug() {
	    debug = false;
	}
	var IsAllowed = function (_PureComponent) {
	    _inherits(IsAllowed, _PureComponent);

	    function IsAllowed() {
	        _classCallCheck(this, IsAllowed);

	        /**
	         * @type {{isAllowed: boolean}}
	         */
	        var _this = _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));

	        _this.state = {
	            isAllowed: false
	        };
	        return _this;
	    }
	    /**
	     * @returns {JSX.Element}
	     */


	    IsAllowed.prototype.render = function render() {
	        return this.state.isAllowed ? this.props.children : null;
	    };
	    /**
	     * @returns {null}
	     */


	    IsAllowed.prototype.componentDidMount = function componentDidMount() {
	        var _this2 = this;

	        var role = this.props.authenticationService.hasIdentity() ? this.props.authenticationService.getRole() : this.props.defaultRole || null;
	        this.props.authorizationService.isAllowed(role, this.props.on, this.props.privilege || null).then(function () {
	            return _this2.setState({
	                isAllowed: true
	            });
	        }).catch(function (e) {
	            return debug ? console.log('IsAllowed() : ' + e) : null;
	        });
	        return null;
	    };

	    return IsAllowed;
	}(_react.PureComponent);
	exports.IsAllowed = IsAllowed = __decorate([(0, _reactDi.inject)({
	    authenticationService: _authentication.AuthenticationService,
	    authorizationService: _AuthorizationService.AuthorizationService
	}), __metadata("design:paramtypes", [])], IsAllowed);
	exports.IsAllowed = IsAllowed;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("@stejar/react");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("@stejar/react-di");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("@stejar/authentication");

/***/ }
/******/ ]);