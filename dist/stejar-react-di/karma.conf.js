const path    = require('path');
const webpack = require('webpack');

module.exports = function (config) {
	config.set({
		logLevel          : config.LOG_DEBUG,
		singleRun         : true,
		browsers          : [ 'PhantomJS' ],
		files             : [
			'./tests/**/*.spec.ts',
			'./tests/**/*.spec.tsx',
		],
		frameworks        : [
			'jasmine',
		],
		reporters         : [ 'progress', 'coverage' ],
		preprocessors     : {
			'./tests/*.spec.ts'  : [ 'webpack', 'sourcemap' ],
			'./tests/*.spec.tsx' : [ 'webpack', 'sourcemap' ],
			'./src/**/*.ts'      : [ 'coverage' ],
			'./src/**/*.tsx'     : [ 'coverage' ],
		},
		coverageReporter  : {
			type : 'html',
			dir  : 'coverage/'
		},
		webpack           : {
			externals   : {
				'jsdom'                          : true,
				'react/addons'                   : true,
				'react/lib/ExecutionEnvironment' : true,
				'react/lib/ReactContext'         : true,
			},
			devtool     : 'inline-source-map',
			resolve     : {
				extensions : [ '.js', '.jsx', '.ts', '.tsx', '.scss' ],
				alias      : {
					'cheerio' : 'cheerio/lib/cheerio'
				}
			},
			module      : {
				rules : [
					{
						enforce : 'pre',
						test    : /\.ts/,
						loader  : 'source-map-loader',
						exclude : [
							/node_modules/
						]
					},
					{
						test    : /\.tsx?$/,
						use     : [
							{
								loader  : "babel-loader",
								options : {
									retainLines : true,
									presets     : [
										"es2015"
									],
									plugins     : [
										'transform-react-jsx',
									]
								}
							},
							{
								loader : "ts-loader",
							},
						],
						exclude : [
							/node_modules/
						]
					},
					{
						test    : /\.tsx?$/,
						enforce : "post",
						use     : [
							{
								loader : "istanbul-instrumenter-loader",
							}
						],
						exclude : [
							/tests/,
							/node_modules/
						]
					},
				],
			},
			performance : {
				hints : false,
			},
			stats       : {
				modules  : false,
				colors   : true,
				reasons  : false,
				children : false,
				chunks   : false
			},
		},
		webpackMiddleware : {
			noInfo : true
		},
	});
};
