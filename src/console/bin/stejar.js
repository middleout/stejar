#!/usr/bin/env node
const program = require("commander");
const makeComponent = require("./../es/commands/makeComponent");
const makeMiddleware = require("./../es/commands/makeMiddleware");
const makeRedux = require("./../es/commands/makeRedux");
const makeModule = require("./../es/commands/makeModule");

const commands = [makeComponent, makeMiddleware, makeRedux, makeModule];
// console.warn(__dirname); // /Users/andrei/work/ubisoft/ubisoft-dashboard/node_modules/@stejar/console/bin

program.version("0.1.0");

commands.forEach(({ command, option, callback }) => {
    const cmd = program.command(command).action(callback);
    if (option) {
        cmd.option(...option);
    }
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
