"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createPager = require("./createPager");

Object.keys(_createPager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createPager[key];
    }
  });
});