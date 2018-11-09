"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setupDebugger = require("./setupDebugger");

Object.keys(_setupDebugger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setupDebugger[key];
    }
  });
});