"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLoader = createLoader;

var _react = require("react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createLoader() {
  var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var usedChunks = [];
  var resolvedKeys = [];
  var resolvedData = [];
  var loaders = [];
  var chunksIds = [];

  function resolve(loader, result) {
    if (Object.keys(result).length === 1) {
      result = result[Object.keys(result)[0]];
    }

    resolvedKeys.push(loader);
    resolvedData.push(result);
    return result;
  }

  var getUsedChunks = function getUsedChunks() {
    return usedChunks;
  };

  var start = function start(paths) {
    var promises = [];
    paths.map(function (chunkId) {
      promises.push(loaders[chunksIds.indexOf(chunkId)]().then(function (result) {
        resolve(loaders[chunksIds.indexOf(chunkId)], result);
      }));
    });
    return Promise.all(promises);
  };

  var preloadAll = function preloadAll() {
    return Promise.all(loaders.map(function (loader) {
      return loader();
    })).then(function (results) {
      results.forEach(function (result, key) {
        return resolve(loaders[key], result);
      });
    });
  };

  var create = function create(chunkId, loader) {
    loaders.push(loader);
    chunksIds.push(chunkId);

    function load() {
      return loader().then(function (component) {
        component = resolve(loader, component);
        var value = chunksIds[loaders.indexOf(loader)];

        if (!usedChunks.includes(value)) {
          usedChunks.push(value);
        }

        return component;
      });
    }

    return {
      load: load,
      component:
      /*#__PURE__*/
      function (_Component) {
        _inherits(LoadComp, _Component);

        function LoadComp(props) {
          var _this;

          _classCallCheck(this, LoadComp);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadComp).call(this, props));

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
            component: null
          });

          if (resolvedKeys.includes(loader)) {
            usedChunks.push(chunksIds[loaders.indexOf(loader)]);
            _this.state.component = resolvedData[resolvedKeys.indexOf(loader)];

            if (debug) {
              console.info("Contains cache for resolved data" + chunkId);
            }
          } else {
            if (debug) {
              console.info("Does not contain resolved data for " + chunkId);
            }
          }

          return _this;
        }

        _createClass(LoadComp, [{
          key: "render",
          value: function render() {
            return this.state.component ? (0, _react.createElement)(this.state.component, this.props) : null;
          }
        }, {
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this2 = this;

            if (this.state.component) {
              return;
            }

            load().then(function (component) {
              return _this2.setState({
                component: component
              });
            });
          }
        }]);

        return LoadComp;
      }(_react.Component)
    };
  };

  return {
    getUsedChunks: getUsedChunks,
    start: start,
    preloadAll: preloadAll,
    create: create
  };
}