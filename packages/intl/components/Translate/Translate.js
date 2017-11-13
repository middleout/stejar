"use strict";

exports.__esModule = true;
exports.Translate = undefined;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = require("lodash.isobject");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactRedux = require("react-redux");

var _selectors = require("../../selectors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _Translate(props) {
    var params = (0, _extends3.default)({}, props);
    delete params.catalog;
    delete params.children;
    delete params.dispatch;
    var translatedValue = void 0;

    try {
        translatedValue = props.catalog[props.children];
        if (!translatedValue) {
            translatedValue = props.children;
        }
    } catch (error) {
        translatedValue = props.children;
    }

    var list = [];
    (0, _keys2.default)(params).forEach(function (name) {
        if ((0, _lodash2.default)(params[name])) {
            list.push(params[name]);

            try {
                translatedValue = translatedValue.replace("%(" + name + ")", "{REACT}");
            } catch (error) {
                console.error(error);
                console.warn(translatedValue);
                console.warn(name);
            }
        } else {
            translatedValue = translatedValue.replace("%(" + name + ")", params[name]);
        }
    });

    if ((0, _keys2.default)(list).length > 0) {
        var result = translatedValue.split("{REACT}");
        var newResult = [];
        var offset = 0;
        result.forEach(function (item) {
            offset++;
            newResult.push(React.createElement("span", { key: offset, className: "dangerousHtml", dangerouslySetInnerHTML: { __html: item } }));
            if (list.length > 0) {
                offset++;
                newResult.push(React.createElement(
                    "span",
                    { key: offset },
                    list.shift()
                ));
            }
        });

        return React.createElement(
            "span",
            null,
            [null].concat(newResult)
        );
    }

    if (-1 !== translatedValue.indexOf("&") || -1 !== translatedValue.indexOf("<") && -1 !== translatedValue.indexOf(">")) {
        return React.createElement("span", { className: "dangerousHtml", dangerouslySetInnerHTML: { __html: translatedValue } });
    }

    return React.createElement(
        "span",
        null,
        translatedValue
    );
}

var mapStateToProps = function mapStateToProps(state) {
    return {
        catalog: (0, _selectors.getCurrentLocaleCatalog)(state)
    };
};
var Translate = exports.Translate = (0, _reactRedux.connect)(mapStateToProps)(_Translate);