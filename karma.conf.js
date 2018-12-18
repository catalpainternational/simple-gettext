// Karma configuration
// Generated on Tue Sep 11 2018 10:59:31 GMT+0900 (East Timor Time)
/* eslint-env node */

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai', 'chai'],

        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chrome-launcher',
            'karma-chai',
            'karma-junit-reporter',
            'karma-sinon-chai'
        ],

        // list of files / patterns to load in the browser
        files: [
            {
                // Chai for testing
                pattern: './node_modules/chai/chai.js', watched: false
            },
            // Specific node_modules as included by src/js/*.js and www/tags/**/*.html files
            // that are being tested / included
            {
                // Used by gettext.js
                pattern: './node_modules/showdown/dist/showdown.min.js', watched: false
            },

            // Specific *.js files being tested / included
            {
                pattern: './gettext.js', included: true, watched: true
            },

            // The test scripts themselves
            './test/*.js',
        ],

        // If you get a warning of the pattern <timestamp>:WARN [web-server]: 404: <some file name>
        // then make sure that <some file name> is included by a file pattern above
        // and that a relevant proxy is added below
        // normally the proxy location will need prepending with '/base' plus the actual full path

        // list of files / patterns to exclude
        exclude: [
        ],

        // test results reporters to use
        // lots of possible values, eg. 'dots', 'progress', 'mocha'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // mocha is the standard mocha reporter
        // junit outputs the results in an xml format consumable by Jenkins
        reporters: ['mocha', 'junit'],

        // The specific settings used by junit for reporting
        // These need to be 'understood' by Jenkins so that it can get the unit test results
        junitReporter: {
            outputDir: 'karma-results',
            outputFile: 'karma-results-simple-gettext.xml',
            useBrowserName: false // This stops the browser (and machine) name being injected into the path
        },

        // chai config - needed for integration with sinon
        client: {
            chai: {
                includeStack: true
            }
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable creation of empty test files
        failOnEmptyTestSuite: false,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // If you have more than one browser then you will need to change the:
        // junitReporter.useBrowserName attribute above to true, and the
        // jenkins post build settings in the jenkins configuration to match the new paths
        // - allowing for the differences between your dev machine and the jenkins environment
        browsers: ['ChromeHeadless'], // ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
