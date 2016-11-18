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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("react");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("react-router");

/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";

exports.__esModule = true;
exports.getRouteName = getRouteName;
function getRouteName(routes) {
    try {
        return routes[routes.length - 1].name;
    } catch (error) {
        return "";
    }
}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.withRouter = withRouter;

var _react = __webpack_require__(0);

var _recompose = __webpack_require__(10);

var _reactRouter = __webpack_require__(1);

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

var hoistStatics = __webpack_require__(9);
function withRouter(WrappedComponent) {
    var connectDisplayName = "WithRouter(" + (0, _recompose.getDisplayName)(WrappedComponent) + ")";
    var WithRouter = function (_Component) {
        _inherits(WithRouter, _Component);

        /**
         * @param props
         */
        function WithRouter(props) {
            _classCallCheck(this, WithRouter);

            var _this = _possibleConstructorReturn(this, _Component.call(this, props));

            _this.router = props.router;
            var oldPush = props.router.push;
            _this.router.push = function (to) {
                if (!to.name) {
                    var routes = props.routes.filter(function (item) {
                        return item.name;
                    });
                    to.name = routes.pop().name;
                }
                to.params = Object.assign({}, props.params, to.params || {});
                return oldPush(to);
            };
            return _this;
        }

        WithRouter.prototype.render = function render() {
            var props = Object.assign({}, this.props, { router: this.router });
            return React.createElement(WrappedComponent, props);
        };

        return WithRouter;
    }(_react.Component);
    /**
     * @type {string}
     */
    WithRouter.displayName = connectDisplayName;
    /**
     * @type {any}
     */
    WithRouter.WrappedComponent = WrappedComponent;
    WithRouter = __decorate([_reactRouter.withRouter, __metadata("design:paramtypes", [Object])], WithRouter);
    return hoistStatics(WithRouter, WrappedComponent);
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _index = __webpack_require__(7);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.Link = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = __webpack_require__(0);

var _reactRouter = __webpack_require__(1);

var _withRouter = __webpack_require__(3);

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

var Link = function (_Component) {
    _inherits(Link, _Component);

    function Link() {
        _classCallCheck(this, Link);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Link.prototype.render = function render() {
        var props = Object.assign({}, this.props);
        var to = props.to;
        if (!to) {
            to = {};
        }
        delete props['to'];
        delete props['router'];
        delete props['location'];
        delete props['routes'];
        delete props['params'];
        if (typeof to !== "string") {
            if (to.params) {
                to.params = this.props.params;
            }
        } else {
            to = {
                name: to,
                params: this.props.params
            };
        }
        return React.createElement(
            _reactRouter.Link,
            _extends({ to: to }, props),
            this.props.children
        );
    };

    return Link;
}(_react.Component);
exports.Link = Link = __decorate([_withRouter.withRouter, __metadata("design:paramtypes", [])], Link);
exports.Link = Link;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.MiddlewareRoute = undefined;

var _reactRouter = __webpack_require__(1);

var _react = __webpack_require__(0);

var _getRouteName = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function redirector(toState, realRedirector) {
    return function (options) {
        if (!options.params) {
            options.params = toState.params;
        }
        if (!options.name) {
            options.name = (0, _getRouteName.getRouteName)(toState.routes);
        }
        return realRedirector(options);
    };
}

var MiddlewareRoute = exports.MiddlewareRoute = function (_Route) {
    _inherits(MiddlewareRoute, _Route);

    function MiddlewareRoute() {
        _classCallCheck(this, MiddlewareRoute);

        return _possibleConstructorReturn(this, _Route.apply(this, arguments));
    }

    /**
     * @param route
     * @returns {any}
     */
    MiddlewareRoute.createRouteFromReactElement = function createRouteFromReactElement(route) {
        var createRouteFromReactElement = _reactRouter.Route.createRouteFromReactElement;
        if (!route.props.middleware) {
            return createRouteFromReactElement(route);
        }
        var onEnter = function onEnter(a, b, c) {
            if (route.props.middleware.onEnter) {
                route.props.middleware.onEnter(a, redirector(a, b)).then(function () {
                    return c();
                });
            } else {
                c();
            }
        };
        var onChange = function onChange(a, b, c, d) {
            if (route.props.middleware.onChange) {
                route.props.middleware.onChange(a, b, redirector(b, c)).then(function () {
                    return d();
                });
            } else {
                d();
            }
        };
        var overridenRoute = (0, _react.cloneElement)(route, Object.assign({}, route.props, {
            onEnter: onEnter,
            onChange: onChange
        }));
        return createRouteFromReactElement(overridenRoute);
    };

    return MiddlewareRoute;
}(_reactRouter.Route);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _Link = __webpack_require__(5);

Object.keys(_Link).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Link[key];
    }
  });
});

var _routeHooks = __webpack_require__(8);

Object.keys(_routeHooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _routeHooks[key];
    }
  });
});

var _withRouter = __webpack_require__(3);

Object.keys(_withRouter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _withRouter[key];
    }
  });
});

var _getRouteName = __webpack_require__(2);

Object.keys(_getRouteName).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getRouteName[key];
    }
  });
});

var _MiddlewareRoute = __webpack_require__(6);

Object.keys(_MiddlewareRoute).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MiddlewareRoute[key];
    }
  });
});

/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
"use strict";

exports.__esModule = true;
exports.onEnterSync = onEnterSync;
exports.onChangeSync = onChangeSync;
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function onEnterSync(resolve) {
    var _this = this;

    return function (a, b, c) {
        return __awaiter(_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return resolve(a, b);

                        case 2:
                            c();

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    };
}
function onChangeSync(resolve) {
    var _this2 = this;

    return function (a, b, c, d) {
        return __awaiter(_this2, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return resolve(a, b, c);

                        case 2:
                            d();

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    };
}

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("hoist-non-react-statics");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("recompose");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }
/******/ ]);