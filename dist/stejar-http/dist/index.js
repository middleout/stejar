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
	__webpack_require__(9);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _FetchAdapter = __webpack_require__(3);

	Object.keys(_FetchAdapter).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _FetchAdapter[key];
	    }
	  });
	});

	var _MocksAdapter = __webpack_require__(6);

	Object.keys(_MocksAdapter).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _MocksAdapter[key];
	    }
	  });
	});

	var _HttpRequest = __webpack_require__(7);

	Object.keys(_HttpRequest).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _HttpRequest[key];
	    }
	  });
	});

	var _HttpResponse = __webpack_require__(5);

	Object.keys(_HttpResponse).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _HttpResponse[key];
	    }
	  });
	});

	var _HttpService = __webpack_require__(8);

	Object.keys(_HttpService).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _HttpService[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.FetchAdapter = undefined;

	var _lodash = __webpack_require__(4);

	var _HttpResponse = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FetchAdapter = exports.FetchAdapter = function () {
	    function FetchAdapter() {
	        _classCallCheck(this, FetchAdapter);
	    }

	    /**
	     * @param request
	     * @returns {Promise<T>}
	     */
	    FetchAdapter.prototype.send = function send(request) {
	        var requestConfig = {
	            cache: "no-cache",
	            method: request.getMethod()
	        };
	        var url = request.getPath();
	        var timeout = request.getTimeout();
	        if (request.getBodyParams()) {
	            requestConfig.body = request.getBodyParams();
	        }
	        if (!(0, _lodash.isEmpty)(request.getHeaderParams())) {
	            if (!requestConfig.headers) {
	                requestConfig.headers = {};
	            }
	            (0, _lodash.each)(request.getHeaderParams(), function (value, name) {
	                requestConfig.headers[name] = value;
	            });
	        }
	        if (!(0, _lodash.isEmpty)(request.getQueryParams())) {
	            url += '?';
	            (0, _lodash.each)(request.getQueryParams(), function (param, name) {
	                if ((0, _lodash.isArray)(param)) {
	                    param.forEach(function (value) {
	                        url += name + "[]=" + value + "&";
	                    });
	                } else {
	                    url += name + "=" + param + "&";
	                }
	            });
	            url = (0, _lodash.trimEnd)(url, '&');
	        }
	        return new Promise(function (resolve, reject) {
	            var rejected = false;
	            var timeoutInterval = setTimeout(function () {
	                rejected = true;
	                reject(new _HttpResponse.HttpResponse(0, 'Application error', request, 'Timeout of ' + timeout + 'ms exceeded for ' + url, {}));
	            }, timeout);
	            function returnAsJSON(response, request, callback) {
	                var cloned = response.clone();
	                cloned.text().then(function (data) {
	                    var responseData = data;
	                    try {
	                        responseData = JSON.parse(data);
	                    } catch (error) {}
	                    callback(new _HttpResponse.HttpResponse(response.status, response.statusText, request, responseData, response.headers));
	                });
	            }
	            fetch(url, requestConfig).then(function (response) {
	                if (rejected) {
	                    return;
	                }
	                clearTimeout(timeoutInterval);
	                if (response.status >= 200 && response.status < 300) {
	                    returnAsJSON(response, request, resolve);
	                    return;
	                }
	                returnAsJSON(response, request, reject);
	                return;
	            }, function (error) {
	                if (!rejected) {
	                    reject(new _HttpResponse.HttpResponse(0, 'Fetch error', request, error, {}));
	                }
	            });
	        });
	    };

	    return FetchAdapter;
	}();

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HttpResponse =
	/**
	 * @param statusCode
	 * @param statusText
	 * @param request
	 * @param data
	 * @param headers
	 */
	exports.HttpResponse = function HttpResponse(statusCode, statusText, request, data, headers) {
	    _classCallCheck(this, HttpResponse);

	    this.statusCode = statusCode;
	    this.statusText = statusText;
	    this.request = request;
	    this.data = data;
	    this.headers = headers;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.MocksAdapter = undefined;

	var _HttpResponse = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = console ? console.log : function () {};

	var MocksAdapter = exports.MocksAdapter = function () {
	    function MocksAdapter() {
	        _classCallCheck(this, MocksAdapter);

	        /**
	         * @type {{}}
	         */
	        this.mocks = {};
	    }
	    /**
	     * @param match
	     * @param method
	     * @param response
	     */


	    MocksAdapter.prototype.mock = function mock(match, method, response) {
	        this.mocks[match] = {
	            method: method,
	            response: response
	        };
	    };
	    /**
	     * @param request
	     * @returns {null}
	     */


	    MocksAdapter.prototype.send = function send(request) {
	        var _this = this;

	        debug('Requesting ' + request.getPath());
	        var found = false;
	        var response = null;
	        Object.keys(this.mocks).forEach(function (key) {
	            if (found) {
	                return;
	            }
	            if (request.getPath().match(new RegExp(key))) {
	                if (_this.mocks[key].method.toLowerCase() === request.getMethod().toLowerCase()) {
	                    found = true;
	                    response = _this.mocks[key].response(request);
	                }
	            }
	        });
	        if (!found) {
	            return Promise.reject(new _HttpResponse.HttpResponse(0, 'Mocks error', request, '[MOCKS ADAPTER] No match found for ' + request.getPath(), {}));
	        }
	        return response.then(function (result) {
	            debug('Loaded ' + request.getPath(), result);
	            if (result instanceof _HttpResponse.HttpResponse) {
	                return result;
	            }
	            return new _HttpResponse.HttpResponse(200, 'OK', request, result, {});
	        });
	    };

	    return MocksAdapter;
	}();

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Method = exports.Method = undefined;
	(function (Method) {
	  Method[Method["GET"] = "GET"] = "GET";
	  Method[Method["POST"] = "POST"] = "POST";
	  Method[Method["PUT"] = "PUT"] = "PUT";
	  Method[Method["DELETE"] = "DELETE"] = "DELETE";
	  Method[Method["PATCH"] = "PATCH"] = "PATCH";
	  Method[Method["OPTIONS"] = "OPTIONS"] = "OPTIONS";
	})(Method || (exports.Method = Method = {}));

	var HttpRequest = function () {
	  /**
	   * @param path
	   */
	  function HttpRequest(path) {
	    _classCallCheck(this, HttpRequest);

	    this.path = path;
	    /**
	     * @type {number}
	     */
	    this.timeoutValue = 30000;
	    /**
	     * @type {Method}
	     */
	    this.method = Method.GET;
	    /**
	     * @type {{}}
	     */
	    this.queryParams = {};
	    /**
	     * @type {{}}
	     */
	    this.headerParams = {};
	    /**
	     * @type {{}}
	     */
	    this.bodyParams = null;
	  }
	  /**
	   * @returns {string}
	   */


	  HttpRequest.prototype.getPath = function getPath() {
	    return this.path;
	  };
	  /**
	   * @returns {Method}
	   */


	  HttpRequest.prototype.getMethod = function getMethod() {
	    return this.method;
	  };
	  /**
	   * @returns {number}
	   */


	  HttpRequest.prototype.getTimeout = function getTimeout() {
	    return this.timeoutValue;
	  };
	  /**
	   * @returns {Blob|FormData|string}
	   */


	  HttpRequest.prototype.getBodyParams = function getBodyParams() {
	    return this.bodyParams;
	  };
	  /**
	   * @returns {Object}
	   */


	  HttpRequest.prototype.getHeaderParams = function getHeaderParams() {
	    return this.headerParams;
	  };
	  /**
	   * @returns {Object}
	   */


	  HttpRequest.prototype.getQueryParams = function getQueryParams() {
	    return this.queryParams;
	  };
	  /**
	   * @param url
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.url = function url(_url) {
	    var request = Object.assign(Object.create(this), this);
	    request.path = _url;
	    return request;
	  };
	  /**
	   * @param timeout
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.timeout = function timeout(_timeout) {
	    var request = Object.assign(Object.create(this), this);
	    request.timeoutValue = _timeout;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.post = function post() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.POST;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.get = function get() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.GET;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.patch = function patch() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.PATCH;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.put = function put() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.PUT;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.delete = function _delete() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.DELETE;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.options = function options() {
	    var request = Object.assign(Object.create(this), this);
	    request.method = Method.OPTIONS;
	    return request;
	  };
	  /**
	   * @param key
	   * @param value
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.query = function query(key, value) {
	    var request = Object.assign(Object.create(this), this);
	    request.queryParams[key] = value;
	    return request;
	  };
	  /**
	   * @param key
	   * @param value
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.header = function header(key, value) {
	    var request = Object.assign(Object.create(this), this);
	    request.headerParams[key] = value;
	    return request;
	  };
	  /**
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.jsonHeaders = function jsonHeaders() {
	    return this.header('Content-Type', 'application/json');
	  };
	  /**
	   * @param value
	   * @returns {HttpRequest}
	   */


	  HttpRequest.prototype.body = function body(value) {
	    var request = Object.assign(Object.create(this), this);
	    request.bodyParams = value;
	    return request;
	  };

	  return HttpRequest;
	}();

	exports.HttpRequest = HttpRequest;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.HttpService = undefined;

	var _HttpResponse = __webpack_require__(5);

	var _FetchAdapter = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HttpService = exports.HttpService = function () {
	    /**
	     * @param adapter
	     */
	    function HttpService() {
	        var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _FetchAdapter.FetchAdapter();

	        _classCallCheck(this, HttpService);

	        this.adapter = adapter;
	        /**
	         * @type {{}}
	         */
	        this.requestsInProgress = {};
	        /**
	         * @type {Array}
	         */
	        this.requestInterceptors = [];
	        /**
	         * @type {Array}
	         */
	        this.responseInterceptors = [];
	        /**
	         * @type {Array}
	         */
	        this.responseErrorInterceptors = [];
	    }
	    /**
	     * @param interceptor
	     * @returns {Function}
	     */


	    HttpService.prototype.addRequestInterceptor = function addRequestInterceptor(interceptor) {
	        var _this = this;

	        this.requestInterceptors.push(interceptor);
	        return function () {
	            var $index = _this.requestInterceptors.indexOf(interceptor);
	            _this.requestInterceptors.splice($index, 1);
	        };
	    };
	    /**
	     * @param interceptor
	     * @returns {Function}
	     */


	    HttpService.prototype.addResponseInterceptor = function addResponseInterceptor(interceptor) {
	        var _this2 = this;

	        this.responseInterceptors.push(interceptor);
	        return function () {
	            var $index = _this2.responseInterceptors.indexOf(interceptor);
	            _this2.responseInterceptors.splice($index, 1);
	        };
	    };
	    /**
	     * @param interceptor
	     * @returns {Function}
	     */


	    HttpService.prototype.addResponseErrorInterceptor = function addResponseErrorInterceptor(interceptor) {
	        var _this3 = this;

	        this.responseErrorInterceptors.push(interceptor);
	        return function () {
	            var $index = _this3.responseErrorInterceptors.indexOf(interceptor);
	            _this3.responseInterceptors.splice($index, 1);
	        };
	    };
	    /**
	     * @param request
	     * @returns {Promise<T>}
	     */


	    HttpService.prototype.send = function send(request) {
	        var _this4 = this;

	        var promise = Promise.resolve(request);
	        for (var i = 0; i < this.requestInterceptors.length; i++) {
	            promise = promise.then(this.requestInterceptors[i]);
	        }
	        var hashKeys = [];
	        return promise.then(function (newRequest) {
	            var hashKey = JSON.stringify(newRequest);
	            if (_this4.requestsInProgress[hashKey]) {
	                return _this4.requestsInProgress[hashKey];
	            }
	            hashKeys.push(hashKey);
	            if (newRequest instanceof _HttpResponse.HttpResponse) {
	                return newRequest;
	            }
	            _this4.requestsInProgress[hashKey] = _this4.adapter.send(newRequest);
	            return _this4.requestsInProgress[hashKey];
	        }).then(function (response) {
	            hashKeys.forEach(function (hashKey) {
	                return delete _this4.requestsInProgress[hashKey];
	            });
	            return response;
	        }).then(function (response) {
	            var promise = Promise.resolve(response);
	            for (var i = 0; i < _this4.responseInterceptors.length; i++) {
	                promise = promise.then(_this4.responseInterceptors[i]);
	            }
	            return promise;
	        }).catch(function (error) {
	            hashKeys.forEach(function (hashKey) {
	                return delete _this4.requestsInProgress[hashKey];
	            });
	            if (_this4.responseErrorInterceptors.length === 0) {
	                return Promise.reject(error);
	            }
	            var promise = Promise.resolve(error);
	            for (var i = 0; i < _this4.responseErrorInterceptors.length; i++) {
	                promise = promise.then(_this4.responseErrorInterceptors[i]).catch(function (error) {
	                    throw error;
	                });
	            }
	            return promise;
	        });
	    };

	    return HttpService;
	}();

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ }
/******/ ]);