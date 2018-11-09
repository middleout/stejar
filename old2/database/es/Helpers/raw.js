"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raw = raw;

function raw(value) {
  return {
    $raw: true,
    getValue: function getValue() {
      return value;
    }
  };
}