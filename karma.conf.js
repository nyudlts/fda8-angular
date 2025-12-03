// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// karma.conf.js

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: false,
      jasmine: {
        failSpecWithNoExpectations: true
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/dspace-angular'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['mocha', 'kjhtml', 'coverage-istanbul'],
    mochaReporter: {
      ignoreSkipped: true,
      output: 'autowatch'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],

    // Override ChromeHeadless to always include --no-sandbox
    customLaunchers: {
      ChromeHeadlessNoSandBox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-extensions'
        ]
      }
    },

    singleRun: false,
    restartOnFileChange: true,

    // Increase timeouts
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    captureTimeout: 210000
  });
};
