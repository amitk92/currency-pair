const webpack = require('webpack')

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'tests.webpack.js' //just load this file
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack']
    },
    webpack: {
      // webpack configuration
      target: "web",
      debug: true,
      module: {
        loaders: [{
          test: /\.spec.js$/,
          loader: 'babel-loader'
        }]
      }
    },
    webpackServer: {
      noInfo: true
    },
    webpackPort: 1234,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: true, // run the tests once and exit.
    autoWatch: true,
    concurrency: Infinity,
    browsers: ['Chrome'], //, 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS', 'Opera', 'IE'
  })
};