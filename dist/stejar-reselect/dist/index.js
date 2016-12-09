'use strict';

var debugLevel = 0;
var debugTable = {};
var debugFns = {};
window.debugTable = debugTable;

exports.__esModule = true;
exports.enableDebug = function(version) {
	version = parseInt(version) || 1;
	if (version !== 0 && version !== 1 && version !== 2) {
		throw new Error("Invalid debug level. Must be 0, 1 or 2");
	}
	debugLevel = version;
}
exports.showDebugTable = function() {

	var table = [];
	Object.keys(debugTable).forEach(function(key){

		var parts = key.split(".");
		if (parts.length > 1) {
			var tmp = {};
			parts.forEach(function (part, idx) {
				tmp["Selector Name " + idx] = part;
			})
			tmp["# runs"] = debugTable[key];
			table.push(tmp);
		} else {
			table.push({
				"Selector Name": key,
				"# runs": debugTable[key]
			})
		}
	});
	console.table(table);
}
exports.defaultEqualityCheck = defaultEqualityCheck;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function defaultEqualityCheck(a, b) {

	if (Array.isArray(a) && Array.isArray(b)) {
		var isEqual = true;
		var length = a.length;

		for (var i = 0; i < length; i++) {
			if (!b[i]) {
				isEqual = false;
				break;
			}

			if (!defaultEqualityCheck(a[i], b[i])) {
				isEqual = false;
				break;
			}
		}

		return isEqual;
	}

	return a === b;
}

function defaultMemoize(name, counter, func) {
	var equalityCheck = arguments.length <= 3 || arguments[3] === undefined ? defaultEqualityCheck : arguments[3];

	var lastArgs = null;
	var lastResult = null;
	return function () {

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (lastArgs === null || lastArgs.length !== args.length || !args.every(function (value, index) {
				return equalityCheck(value, lastArgs[index]);
			})) {
			counter(args, func.wrappedFunc);
			lastResult = func.apply(undefined, args);
		}
		lastArgs = args;

		if (name) {
			if (debugLevel === 2) console.log('[RESELECT] ',name, ' returned ', lastResult, ' for call with args ', args);
		}

		return lastResult;
	};
}

function getDependencies(funcs) {
	var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

	if (!dependencies.every(function (dep) {
			return typeof dep === 'function';
		})) {
		var dependencyTypes = dependencies.map(function (dep) {
			return typeof dep;
		}).join(', ');
		throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
	}

	return dependencies;
}

function createSelectorCreator(memoize, equalityCheck) {
	for (var _len2 = arguments.length, memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		memoizeOptions[_key2 - 1] = arguments[_key2];
	}

	return function () {
		for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			funcs[_key3] = arguments[_key3];
		}

		var name = "";
		if (typeof funcs[0] === "string") {
			name = funcs.shift();
		}

		if (name) {
			if (debugLevel === 1) console.log('[RESELECT] Creating selector ', name);
			debugTable[name] = 0;
		}

		var recomputations = 0;
		var resultFunc = funcs.pop();
		var dependencies = getDependencies(funcs);

		var insider = function () {
			recomputations++;
			return resultFunc.apply(undefined, arguments);
		};
		insider.wrappedFunc = resultFunc;

		var memoizedResultFunc = memoize.apply(undefined, [name, function(args, func) {
			if (name) {
				if (!debugFns[name] && debugLevel > 0) {
					debugFns[name] = func;
				}
				if (debugFns[name] && debugFns[name] !== func) {
					console.error('[@stejar/reselect ERROR]: There are at least 2 Selectors with the name "' + name + '" (the name is used multiple times by different selectors');
					console.error(debugFns[name])
					console.error(func)
				}

				if (debugLevel === 1) console.log('[RESELECT] Running ', name, ' with args ', args);
				debugTable[name] += 1;
			}
		}, insider, equalityCheck].concat(memoizeOptions));

		var selector = function selector(state, props) {
			for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
				args[_key4 - 2] = arguments[_key4];
			}

			var params = dependencies.map(function (dependency) {
				return dependency.apply(undefined, [state, props].concat(args));
			});
			return memoizedResultFunc.apply(undefined, _toConsumableArray(params));
		};

		selector.resultFunc = resultFunc;
		selector.recomputations = function () {
			return recomputations;
		};
		selector.resetRecomputations = function () {
			return recomputations = 0;
		};
		return selector;
	};
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize, defaultEqualityCheck);

function createStructuredSelector(selectors) {
	var selectorCreator = arguments.length <= 1 || arguments[1] === undefined ? createSelector : arguments[1];

	if (typeof selectors !== 'object') {
		throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
	}
	var objectKeys = Object.keys(selectors);
	return selectorCreator(objectKeys.map(function (key) {
		return selectors[key];
	}), function () {
		for (var _len5 = arguments.length, values = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			values[_key5] = arguments[_key5];
		}

		return values.reduce(function (composition, value, index) {
			composition[objectKeys[index]] = value;
			return composition;
		}, {});
	});
}
