import "source-map-support/register";
import { colorConsole } from "tracer";

export function setupDebugger() {
    const { debug, trace, info, warn } = colorConsole({
        inspectOpt: {
            showHidden: true,
            depth: 4,
        },
        format: '\n[{{timestamp}}] "{{file}}" at line {{line}} at time\n  {{message}}',
        dateformat: "HH:MM:ss.L",
    });

    // console.log = debug.bind(console); // doesn't work
    console.debug = debug.bind(console);
    console.trace = trace.bind(console);
    console.info = info.bind(console);
    console.warn = warn.bind(console);
    // console.error = error.bind(console); // doesn't work
}
