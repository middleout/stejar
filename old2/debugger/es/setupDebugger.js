"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupDebugger = setupDebugger;

require("source-map-support/register");

var _tracer = require("tracer");

function setupDebugger() {
  var _colorConsole = (0, _tracer.colorConsole)({
    inspectOpt: {
      showHidden: true,
      depth: 4
    },
    format: '\n[{{timestamp}}] "{{file}}" at line {{line}}\n\n_____\n{{message}}\n-----\n',
    dateformat: "HH:MM:ss.L"
  }),
      debug = _colorConsole.debug,
      trace = _colorConsole.trace,
      info = _colorConsole.info,
      warn = _colorConsole.warn; // console.log = debug.bind(console); // doesn't work


  console.debug = debug.bind(console);
  console.trace = trace.bind(console);
  console.info = info.bind(console);
  console.warn = warn.bind(console); // console.error = error.bind(console); // doesn't work
}