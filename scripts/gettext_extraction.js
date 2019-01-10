/** Purpose: Identifies issues with the use of gettext throughout the sourcecode
* And performs a naive fix of any issues it finds
*
* It does this by:
* Reading from the gettext.js or extendGettext.js files and extracting a current set of translations
* Reading every .js and tag .html file and extracting all usages of gettext()
* Comparing the above for discrepancies
* Adding any discrepancies found back into gettext.js or extendGettext.js
*
* After that (what this code does not do):
* A developer/designer must read gettext.js and supply correct translations
* for the discrepancies
*/
/* eslint-env node */
var path = require('path');
var fs = require('fs');
var glob = require('glob');

const cwd = path.resolve('./');
const re = new RegExp(cwd, 'g');

// make a Promise version of fs.readFile() - note that v10 of Node has this already
fs.readFileAsync = function(filename, enc) {
    console.log(` - reading file: ${filename.replace(re, '')}`);
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// utility function, return Promise
function getFile(filename) {
    return fs.readFileAsync(filename, 'utf8');
}

function getDirListingAsPromise(globPath) {
    var filenames = [];
    try {
        filenames = glob.sync(globPath);
        return Promise.resolve(filenames);
    } catch (err) {
        return Promise.reject(err);
    }
}

function getDirListing(globPath) {
    var filenames = [];
    try {
        filenames = glob.sync(globPath);
        return filenames;
    } catch (err) {
        return [];
    }
}

console.log();
console.log('Gettext Extraction');
console.log(` - processing directory: ${cwd}`);
const commonGettextSourceFiles = getDirListing(`${cwd}/node_modules/simple-gettext/gettext.js`);
const extendGettextSourceFiles = getDirListing(`${cwd}/*{src/js,js,src}/extendGettext.js`);
const gettextSourceFiles = commonGettextSourceFiles.concat(extendGettextSourceFiles);
console.log(` - gettext source files: ${gettextSourceFiles.join(' ').replace(re, '')}`);

const allGettextDeclarations = Promise.all(gettextSourceFiles.map(gettextSourceFile => {
    return fs
        .readFileAsync(gettextSourceFile, 'utf8')
        .then(function(data) {
            var gettext_declaration = {};

            // data is a Buffer, convert to string.
            var text = data.toString();

            // For older Javascript use this
            var extractorRegex = /(?:('.*'):\s*('.*'|undefined))/gmi;
            // For up to date Javascript, that supports named groups, use the following instead
            // var extractorRegex = /(?:(?<en>'.*'):\s*(?<tet>'.*'))/gmi;

            var extractionResult;
            while (extractionResult = extractorRegex.exec(text)) { /* eslint-disable-line no-cond-assign */
                // For older Javascript use this
                gettext_declaration[extractionResult['1']] = { 'tet': extractionResult['2'], 'usage': [] };
                // For up to date Javascript, that supports named groups, use the following instead
                // gettext_declaration[extractionResult.groups.en] = { 'tet': extractionResult.groups.tet, 'usage': [] };
            }

            return Promise.resolve(gettext_declaration);
        })
        .catch(function(err) {
            return Promise.reject(err);
        });
}));

const sourceJsFiles = getDirListingAsPromise(`${cwd}/src/**/!(gettext|extendGettext|extendGettext_old).js`);
const sourceTagsFiles = getDirListingAsPromise(`${cwd}/www/tags/**/*.html`);

const allSourceFiles = Promise
    .all([sourceJsFiles, sourceTagsFiles])
    .then(function(results) {
        var allResults = results[0].concat(results[1]);
        return Promise.resolve(allResults);
    })
    .catch(function(err) {
        return Promise.reject(err);
    });

Promise.all([allSourceFiles, allGettextDeclarations])
    .then(function(results) {
        var filenames = results[0];
        var gettextDeclarations = {};
        results[1].forEach((declarationSet) => {
            Object.keys(declarationSet).forEach(function(declarationKey) {
                gettextDeclarations[declarationKey] = declarationSet[declarationKey];
            });
        });
        console.log(` - files using gettext: ${filenames.join(' ').replace(re, '')}`);

        const usageResults = [];
        filenames.forEach(function(filename) {
            var usageResult = getFile(filename)
                .then(function(file) {
                    var gettext_usages = [];

                    var text = file.toString();

                    // For older Javascript use this
                    var gettextUsageRegex = /(?:gettext\(('.*?')\))/gmi;
                    // For up to date Javascript, that supports named groups, use the following instead
                    // var gettextUsageRegex = /(gettext\((?<en>'.*?')\))/gmi;

                    var usageRegexResult;
                    while (usageRegexResult = gettextUsageRegex.exec(text)) { /* eslint-disable-line no-cond-assign */
                        // For older Javascript use this
                        gettext_usages.push(usageRegexResult['1']);
                        // For up to date Javascript, that supports named groups, use the following instead
                        // gettext_usages.push(usageRegexResult.groups.en);
                    }

                    if (gettext_usages.length > 0) {
                        gettext_usages.forEach(function(gettextUsage) {
                            var cleanedGettextUsage = `'${gettextUsage.substring(1, gettextUsage.length - 1).replace(/'/g, '\\\'')}'`;
                            if (gettextDeclarations[gettextUsage]) {
                                gettextDeclarations[gettextUsage].usage.push(filename);
                            } else if (gettextDeclarations[cleanedGettextUsage]) {
                                gettextDeclarations[cleanedGettextUsage].usage.push(filename);
                            } else {
                                gettextDeclarations[cleanedGettextUsage] = { 'en': cleanedGettextUsage, 'err': 'not in gettext.js or extendGettext.js', 'usage': [filename] };
                            }
                        });
                    }

                    return Promise.resolve(filename);
                });

            usageResults.push(usageResult);
        });

        Promise.all(usageResults)
            .then(function() {
                var errors = [];
                Object.keys(gettextDeclarations).forEach(function(gettextDeclarationKey) {
                    if (gettextDeclarations[gettextDeclarationKey].err) {
                        errors.push(`    ${gettextDeclarationKey}: undefined,`);
                    }
                });

                if (errors.length > 0) {
                    // Update extendGettext.js with these values
                    const oldGettext = `${cwd}/src/js/extendGettext_old.js`;
                    const updatedGettext = extendGettextSourceFiles[0];

                    fs.renameSync(updatedGettext, oldGettext);

                    getFile(oldGettext)
                        .then(function(file) {
                            var lines = file.toString().split('\n');
                            while (lines[lines.length - 1] === '') {
                                lines.pop();
                            }
                            lines.forEach(function(line) {
                                fs.appendFileSync(updatedGettext, `${line}\n`);
                                if (line.trim().startsWith('\'tet\':') || line.trim().indexOf('\'tet\',') > -1) {
                                    errors.forEach(function(errorLine) {
                                        fs.appendFileSync(updatedGettext, `${errorLine}\n`);
                                    });
                                }
                            });

                            fs.unlink(oldGettext, function() { /* Don't care */ });
                        });
                }
            });
    })
    .catch(function(err) {
        console.log(err);
    });
