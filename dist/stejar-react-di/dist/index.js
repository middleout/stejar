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

	var _shape = __webpack_require__(3);

	Object.keys(_shape).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _shape[key];
	    }
	  });
	});

	var _inject = __webpack_require__(5);

	Object.keys(_inject).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _inject[key];
	    }
	  });
	});

	var _ServiceProvider = __webpack_require__(9);

	Object.keys(_ServiceProvider).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _ServiceProvider[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.shape = undefined;

	var _react = __webpack_require__(4);

	var shape = exports.shape = _react.PropTypes.object;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.inject = inject;

	var _lodash = __webpack_require__(6);

	var _react = __webpack_require__(4);

	var _invariant = __webpack_require__(7);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _shape = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var hoistStatics = __webpack_require__(8);

	function getDisplayName(WrappedComponent) {
	    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	/**
	 * @param mapItemsToProps
	 * @returns {function(any): any}
	 */
	function inject(mapItemsToProps) {
	    return function wrapWithConnect(WrappedComponent) {
	        var connectDisplayName = "Inject(" + getDisplayName(WrappedComponent) + ")";

	        var Connect = function (_Component) {
	            _inherits(Connect, _Component);

	            /**
	             * @param props
	             * @param context
	             */
	            function Connect(props, context) {
	                _classCallCheck(this, Connect);

	                var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

	                _this.state = {
	                    hasEverythingItNeeds: false
	                };
	                _this.serviceManager = props.serviceManager || context.serviceManager;
	                var hasUndefined = Object.keys(props).length === 0 && Object.keys(mapItemsToProps).length > 0 ? true : false;
	                Object.keys(props).forEach(function (key) {
	                    if (-1 === Object.keys(mapItemsToProps).indexOf(key)) {
	                        hasUndefined = true;
	                    }
	                });
	                if (hasUndefined) {
	                    (0, _invariant2.default)(_this.serviceManager, "Could not find \"serviceManager\" in either the context or " + ("props of \"" + connectDisplayName + "\". ") + "Either wrap the root component in a <Provider>, " + ("or explicitly pass \"serviceManager\" as a prop to \"" + connectDisplayName + "\"."));
	                } else {
	                    _this.state.hasEverythingItNeeds = true;
	                }
	                return _this;
	            }

	            Connect.prototype.render = function render() {
	                var _this2 = this;

	                var toInject = {};
	                if (!this.state.hasEverythingItNeeds) {
	                    (function () {
	                        var data = {};
	                        Object.keys(mapItemsToProps).forEach(function (key) {
	                            data[key] = _this2.serviceManager.get(mapItemsToProps[key]);
	                        });
	                        toInject = (0, _lodash.assign)({}, _this2.props, data);
	                    })();
	                } else {
	                    toInject = this.props;
	                }
	                return (0, _react.createElement)(WrappedComponent, toInject);
	            };

	            return Connect;
	        }(_react.Component);
	        /**
	         * @type {string}
	         */


	        Connect.displayName = connectDisplayName;
	        /**
	         * @type {any}
	         */
	        Connect.WrappedComponent = WrappedComponent;
	        /**
	         * @type {{serviceManager: Requireable<any>}}
	         */
	        Connect.contextTypes = {
	            serviceManager: _shape.shape
	        };
	        /**
	         * @type {{serviceManager: Requireable<any>}}
	         */
	        Connect.propTypes = {
	            serviceManager: _shape.shape
	        };
	        return hoistStatics(Connect, WrappedComponent);
	    };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("invariant");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("hoist-non-react-statics");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.ServiceProvider = undefined;

	var _react = __webpack_require__(4);

	var React = _interopRequireWildcard(_react);

	var _shape = __webpack_require__(3);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ServiceProvider = exports.ServiceProvider = function (_React$Component) {
	    _inherits(ServiceProvider, _React$Component);

	    /**
	     * @param props
	     * @param context
	     */
	    function ServiceProvider(props, context) {
	        _classCallCheck(this, ServiceProvider);

	        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

	        _this.serviceManager = props.serviceManager;
	        return _this;
	    }
	    /**
	     * @returns {{serviceManager: ServiceManager}}
	     */


	    ServiceProvider.prototype.getChildContext = function getChildContext() {
	        return { serviceManager: this.serviceManager };
	    };
	    /**
	     * @returns {ReactElement<any>}
	     */


	    ServiceProvider.prototype.render = function render() {
	        return React.Children.only(this.props.children);
	    };

	    return ServiceProvider;
	}(React.Component);
	/**
	 * @type {{serviceManager: Validator<T>, children: Validator<any>}}
	 */


	ServiceProvider.propTypes = {
	    serviceManager: _shape.shape.isRequired,
	    children: React.PropTypes.element.isRequired
	};
	/**
	 * @type {{serviceManager: Validator<T>}}
	 */
	ServiceProvider.childContextTypes = {
	    serviceManager: _shape.shape.isRequired
	};

/***/ }
/******/ ]);