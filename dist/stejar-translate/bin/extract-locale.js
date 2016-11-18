#! /usr/bin/env node
const fs   = require('fs');
const path = require('path');

var walkSync = function (dir, filelist) {
	var files = fs.readdirSync(dir);
	filelist  = filelist || [];
	files.forEach(function (file) {
		if ( fs.statSync(dir + file).isDirectory() ) {
			filelist = walkSync(dir + file + '/', filelist);
		}
		else {
			if ( file.indexOf('.ts') !== -1 ) {
				filelist.push(dir + file);
			}
		}
	});
	return filelist;
};

function extractLocale() {
	var locale   = [];
	var fileList = [];

	walkSync(path.join(__dirname, '../', 'app', '/'), fileList);

	function extract(content, fileName) {

		var currentOpened  = 0;
		var offset         = -1;
		var startPositions = [];
		var endPositions   = [];

		for ( var i = 0; i < content.length; i++ ) {
			if ( content.substr(i, 10).toLowerCase() === '<translate' ) {
				startPositions.push(i);
				offset++;
				currentOpened++;
			}

			if ( startPositions.length > 0 && content.substr(i, 12).toLowerCase() === '</translate>' ) {
				endPositions.unshift(i + 12);
				currentOpened--;

				if ( currentOpened == 0 ) {
					while ( startPositions.length > 0 ) {
						var substr = content.substring(startPositions[ offset ], endPositions[ offset ]).replace(/\s\s+/g, ' ');

						var searchedPos    = 0;
						var _innerOpenTags = 0;
						for ( var k = 0; k < substr.length; k++ ) {
							if ( substr[ k ] === "<" ) {
								_innerOpenTags++;
							}
							if ( substr[ k ] === ">" ) {
								if ( _innerOpenTags === 1 ) {
									searchedPos = k;
								} else {
									_innerOpenTags--;
								}
							}
						}

						var term = substr.substring(searchedPos + 1, substr.length - "</Translate>".length);
						term = term.trim();
						term = term.replace("{'", "");
						term = term.replace("'}", "");
						term = term.replace('{"', "");
						term = term.replace('"}', "");

						var existing = false;
						locale.forEach(function(item){
							if (item.term === term && item.reference === fileName) {
								existing = true;
							}
						});

						if (!existing) {
							locale.push({
								term        : term,
								definition  : "",
								context     : "",
								term_plural : "",
								reference   : fileName,
								comment     : "",
							});
						}

						startPositions.pop();
						endPositions.pop();
						offset--;
					}
				}

			}
		}
	}

	fileList.forEach(file => {
		var content = fs.readFileSync(file, 'utf-8');
		extract(content, file.split('app')[ 1 ]);
	});

	fs.writeFileSync(path.join(__dirname, '../', 'resources', 'locales', 'template.json'), JSON.stringify(locale));
}

extractLocale();

