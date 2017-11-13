"use strict";

exports.__esModule = true;
exports.translator = translator;

var _selectors = require("../../selectors");

function translator(store) {
    return function (str) {
        return (0, _selectors.getCurrentLocaleCatalog)(store.getState())[str] || str;
    };
}