"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTerminal = clearTerminal;
exports.default = void 0;

function clearTerminal() {
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}

var _default = clearTerminal;
exports.default = _default;