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
/***/ function(module, exports) {

"use strict";
'use strict';

exports.__esModule = true;
exports.namespace = namespace;
exports.getNamespacedName = getNamespacedName;
/**
 * @param namespace
 * @returns {function(Function): Function}
 */
/**
 * @param namespace
 * @returns {function(Function): Function}
 */function namespace(namespace) {
    return function namespacedClass(entity) {
        entity.namespace = namespace;
        return entity;
    };
}
/**
 * @param object
 * @returns {string}
 */
function getNamespacedName(object) {
    var name = typeof object === "function" ? object.name : object.constructor.name;
    if (object.namespace) {
        name = object.namespace + '/' + name;
    }
    if (object.constructor.namespace) {
        name = object.constructor.namespace + '/' + name;
    }
    return name;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _src = __webpack_require__(5);

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
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractProvider = exports.AbstractProvider = function AbstractProvider() {
  _classCallCheck(this, AbstractProvider);
};

/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
"use strict";

exports.__esModule = true;
exports.Resolver = Resolver;
/**
 * @param serviceManager
 * @param classToInvoke
 * @returns {function(...[any]): any}
 * @constructor
 */
function Resolver(classToInvoke) {
    var methodToInvoke = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "invoke";

    return function (serviceManager) {
        return function resolveViaClass() {
            var _serviceManager$get;

            return (_serviceManager$get = serviceManager.get(classToInvoke))[methodToInvoke].apply(_serviceManager$get, arguments);
        };
    };
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;
exports.ServiceManager = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(8);

var _namespaceUtils = __webpack_require__(0);

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

var invariant = __webpack_require__(7);

var ServiceManager_1 = function () {
    /**
     * @constructor
     */
    function ServiceManager() {
        _classCallCheck(this, ServiceManager);

        /**
         * @type {{}}
         */
        this.container = {};
        /**
         * @type {{}}
         */
        this.providers = {};
        /**
         * @type {{}}
         */
        this.implementsList = {};
        this.bind(ServiceManager_1, this);
    }
    /**
     * @param resource
     * @param instance
     */


    ServiceManager.prototype.bind = function bind(resource, instance) {
        this.container[this.getNameFromResource(resource)] = instance;
        return this;
    };
    /**
     * @param resource
     * @param aliasName
     * @returns {ServiceManager}
     */


    ServiceManager.prototype.alias = function alias(resource, aliasName) {
        var _this = this;

        this.providers[this.getNameFromResource(resource)] = function () {
            return _this.get(aliasName);
        };
        return this;
    };
    /**
     * @param method
     * @param object
     * @returns {this}
     */


    ServiceManager.prototype.bindToMethod = function bindToMethod(method, object) {
        this.implementsList[method] = object;
        return this;
    };
    /**
     * @param factory
     */


    ServiceManager.prototype.factory = function factory(_factory) {
        _factory(this);
    };
    /**
     * @param className
     * @param callback
     * @returns {this}
     */


    ServiceManager.prototype.provide = function provide(className, callback) {
        var _this2 = this;

        this.providers[this.getNameFromResource(className)] = function () {
            var instance = callback(_this2);
            if (!instance) {
                throw new Error("The provider for the class \"" + className.name + "\" must provide an instance of this class when initialized.");
            }
            _this2.bind(_this2.getNameFromResource(className), instance);
            return instance;
        };
        return this;
    };
    /**
     * @param provider
     * @returns {this}
     */


    ServiceManager.prototype.provider = function provider(_provider) {
        var realProvider = new _provider();
        this.provide(realProvider.provides(), realProvider.provide.bind(realProvider));
        return this;
    };
    /**
     * @param resource
     * @returns {any}
     */


    ServiceManager.prototype.get = function get(resource) {
        if (this.container[this.getNameFromResource(resource)]) {
            return this.container[this.getNameFromResource(resource)];
        }
        if (this.providers[this.getNameFromResource(resource)]) {
            return this.providers[this.getNameFromResource(resource)](this);
        }
        var result = this.instantiate(resource);
        invariant(result, "Could not \"get\" " + this.getNameFromResource(resource));
        this.bind(resource, result);
        return result;
    };
    /**
     * @param resource
     */


    ServiceManager.prototype.instantiate = function instantiate(resource) {
        var _this3 = this;

        var args = Reflect.getMetadata('design:paramtypes', resource);
        if (typeof args === "undefined") {
            throw new Error("Could not get constructor dependencies for " + resource.name + ". Did you forget to decorate it with @injectable ?");
        }
        if (!args) {
            return new resource();
        }
        var dependencies = [];
        try {
            args.forEach(function (arg) {
                return dependencies.push(_this3.get(arg));
            });
        } catch (error) {
            console.warn("Could not get constructor dependencies for " + resource.name + ". Please check the bellow error for more details.");
            throw error;
        }
        var instance = new (Function.prototype.bind.apply(resource, [null].concat(dependencies)))();
        Object.keys(this.implementsList).forEach(function (key) {
            if (key in instance) {
                instance[key](_this3.get(_this3.implementsList[key]));
            } else {
                for (var item in instance) {
                    if (key === item) {
                        instance[key](_this3.get(_this3.implementsList[key]));
                    }
                }
            }
        });
        return instance;
    };
    /**
     * @param resource
     * @returns {string}
     */


    ServiceManager.prototype.getNameFromResource = function getNameFromResource(resource) {
        if (typeof resource === "string") {
            return resource;
        }
        return (0, _namespaceUtils.getNamespacedName)(resource);
    };

    return ServiceManager;
}();
var ServiceManager = ServiceManager_1;
exports.ServiceManager = ServiceManager = ServiceManager_1 = __decorate([(0, _namespaceUtils.namespace)('Stejar/Core'), __metadata("design:paramtypes", [])], ServiceManager);
exports.ServiceManager = ServiceManager;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

exports.__esModule = true;

var _ServiceManager = __webpack_require__(4);

Object.keys(_ServiceManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ServiceManager[key];
    }
  });
});

var _AbstractProvider = __webpack_require__(2);

Object.keys(_AbstractProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AbstractProvider[key];
    }
  });
});

var _namespaceUtils = __webpack_require__(0);

Object.keys(_namespaceUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _namespaceUtils[key];
    }
  });
});

var _injectable = __webpack_require__(6);

Object.keys(_injectable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _injectable[key];
    }
  });
});

var _Resolver = __webpack_require__(3);

Object.keys(_Resolver).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Resolver[key];
    }
  });
});

/***/ },
/* 6 */
/***/ function(module, exports) {

"use strict";
"use strict";

exports.__esModule = true;
exports.injectable = injectable;
function injectable(WrappedClass) {
    return WrappedClass;
}

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("invariant");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("reflect-metadata");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }
/******/ ]);