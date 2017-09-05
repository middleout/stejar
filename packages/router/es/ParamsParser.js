import _Object$keys from "babel-runtime/core-js/object/keys";
import _extends from "babel-runtime/helpers/extends";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
export var ParamsParser = function () {
    function ParamsParser() {
        _classCallCheck(this, ParamsParser);
    }

    _createClass(ParamsParser, [{
        key: "parseQuery",

        /**
         * @param qstr
         * @returns {{}}
         */
        value: function parseQuery(qstr) {
            if (!qstr) {
                return {};
            }

            var query = {};
            var a = (qstr[0] === "?" ? qstr.substr(1) : qstr).split("&");
            for (var i = 0; i < a.length; i++) {
                var b = a[i].split("=");
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
            }
            return query;
        }

        /**
         * @param matchedParams
         * @returns {{}}
         */

    }, {
        key: "parseMatchedParams",
        value: function parseMatchedParams(matchedParams) {
            var params = _extends({}, matchedParams);
            delete params._masked;
            _Object$keys(params).forEach(function (param) {
                if (params[param].indexOf("?") !== -1) {
                    params[param] = params[param].split("?")[0];
                }
            });

            return params;
        }

        /**
         * @param current
         * @param provided
         * @returns {{}}
         */

    }, {
        key: "buildParams",
        value: function buildParams() {
            var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var provided = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return _extends({}, current, provided);
        }

        /**
         * @param current
         * @param provided
         * @returns {string}
         */

    }, {
        key: "buildQueryString",
        value: function buildQueryString() {
            var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var provided = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var obj = _extends({}, current, provided);
            var str = "?";
            _Object$keys(obj).forEach(function (key) {
                str += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
                str += "&";
            });

            return str.substr(0, str.length - 1);
        }
    }]);

    return ParamsParser;
}();