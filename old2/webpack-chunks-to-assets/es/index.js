"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parseWebpackChunksToAssets = require("./parseWebpackChunksToAssets");

Object.keys(_parseWebpackChunksToAssets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _parseWebpackChunksToAssets[key];
    }
  });
});