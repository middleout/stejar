import generateWebpackCompiler from "./generateWebpackCompiler";
import express from "./express";

const compiler = generateWebpackCompiler(true);
compiler.run(() => console.log('Application built !'));
