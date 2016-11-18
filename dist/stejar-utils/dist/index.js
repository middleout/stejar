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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _scriptLoader = __webpack_require__(3);

	Object.keys(_scriptLoader).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _scriptLoader[key];
	    }
	  });
	});

	var _PromiseService = __webpack_require__(4);

	Object.keys(_PromiseService).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _PromiseService[key];
	    }
	  });
	});

	var _Observable = __webpack_require__(7);

	Object.keys(_Observable).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _Observable[key];
	    }
	  });
	});

	var _Subject = __webpack_require__(8);

	Object.keys(_Subject).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _Subject[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.loadScript = loadScript;
	function loadScript(url) {
	    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30000;

	    return new Promise(function (resolve, reject) {
	        var script = document.createElement('script');
	        var prior = document.getElementsByTagName('script')[0];
	        script.async = 1;
	        prior.parentNode.insertBefore(script, prior);
	        var resolved = false;
	        var timeoutVar = setTimeout(function () {
	            if (!resolved) {
	                reject();
	            }
	        }, timeout);
	        script.onload = script.onreadystatechange = function (_, isAbort) {
	            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
	                script.onload = script.onreadystatechange = null;
	                script = undefined;
	                if (!isAbort) {
	                    resolved = true;
	                    clearTimeout(timeoutVar);
	                    resolve();
	                }
	            }
	        };
	        script.src = url;
	    });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.PromiseService = exports.PromiseStatus = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	var pe = __webpack_require__(6);
	var PromiseStatus = exports.PromiseStatus = undefined;
	(function (PromiseStatus) {
	    PromiseStatus[PromiseStatus["RESOLVED"] = "resolved"] = "RESOLVED";
	    PromiseStatus[PromiseStatus["REJECTED"] = "rejected"] = "REJECTED";
	})(PromiseStatus || (exports.PromiseStatus = PromiseStatus = {}));
	var PromiseService = function () {
	    function PromiseService() {
	        _classCallCheck(this, PromiseService);
	    }

	    /**
	     * @param data
	     * @returns {Promise<any>}
	     */
	    PromiseService.prototype.allSettled = function allSettled() {
	        for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
	            data[_key] = arguments[_key];
	        }

	        return pe.array.allSettled(data);
	    };
	    /**
	     * @param promises
	     * @returns {function(...[any]): any}
	     */


	    PromiseService.prototype.chain = function chain(promises) {
	        return function () {
	            if (promises.length === 0) {
	                return Promise.resolve(arguments.length > 0 ? arguments.length <= 0 ? undefined : arguments[0] : null);
	            }
	            var promise = promises[0].apply(promises, arguments);
	            for (var i = 1; i < promises.length; i++) {
	                promise = promise.then(promises[i]);
	            }
	            return promise;
	        };
	    };
	    /**
	     * @param data
	     * @returns {Promise<T>}
	     */


	    PromiseService.prototype.hashAll = function hashAll(entry) {
	        return pe.array.objectAll(entry);
	    };
	    /**
	     * @param data
	     * @returns {Promise<T>}
	     */


	    PromiseService.prototype.hashSettled = function hashSettled(entry) {
	        var list = Object.keys(entry).map(function (entryName) {
	            return entry[entryName];
	        });
	        return this.allSettled.apply(this, list).then(function (results) {
	            return results.reduce(function (map, result, index) {
	                return map[Object.keys(entry)[index]] = result;
	            }, {});
	        });
	    };
	    /**
	     * @param timeout
	     * @returns {Promise<any>}
	     */


	    PromiseService.prototype.delay = function delay(timeout) {
	        return pe.delay(timeout);
	    };

	    return PromiseService;
	}();
	exports.PromiseService = PromiseService = __decorate([_di.injectable, __metadata("design:paramtypes", [])], PromiseService);
	exports.PromiseService = PromiseService;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("@stejar/di");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("@hughfdjackson/promise-extras");

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observable = exports.Observable = function () {
	    function Observable() {
	        _classCallCheck(this, Observable);

	        /**
	         * @type {Array}
	         */
	        this.listeners = [];
	    }
	    /**
	     * @param callback
	     * @returns {()=>Function[]}
	     */


	    Observable.prototype.subscribe = function subscribe(callback) {
	        var _this = this;

	        this.listeners.push(callback);
	        return function () {
	            var index = _this.listeners.indexOf(callback);
	            _this.listeners.splice(index, 1);
	        };
	    };
	    /**
	     * @param value
	     * @returns {null}
	     */


	    Observable.prototype.onNext = function onNext(value) {
	        this.listeners.forEach(function (item) {
	            return item(value);
	        });
	        return null;
	    };
	    /**
	     * @returns {Observable}
	     */


	    Observable.prototype.asObservable = function asObservable() {
	        var observable = new Observable();
	        this.subscribe(function (value) {
	            return observable.onNext(value);
	        });
	        return observable;
	    };

	    return Observable;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.Subject = undefined;

	var _Observable2 = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Subject = exports.Subject = function (_Observable) {
	    _inherits(Subject, _Observable);

	    /**
	     * @param value
	     */
	    function Subject(value) {
	        _classCallCheck(this, Subject);

	        var _this = _possibleConstructorReturn(this, _Observable.call(this));

	        _this.value = value;
	        return _this;
	    }
	    /**
	     * @param value
	     */


	    Subject.prototype.emit = function emit(value) {
	        var _this2 = this;

	        this.value = value;
	        this.listeners.forEach(function (item) {
	            return item(_this2.value);
	        });
	    };
	    /**
	     * @param callback
	     * @returns {Function}
	     */


	    Subject.prototype.subscribe = function subscribe(callback) {
	        var unsub = _Observable.prototype.subscribe.call(this, callback);
	        this.emit(this.value);
	        return unsub;
	    };
	    /**
	     * @returns {T}
	     */


	    Subject.prototype.getValue = function getValue() {
	        return this.value;
	    };

	    return Subject;
	}(_Observable2.Observable);

/***/ }
/******/ ]);