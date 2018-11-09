"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createLoader = require("./createLoader");

Object.keys(_createLoader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createLoader[key];
    }
  });
});