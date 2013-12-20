module.exports = function (config) {

  config.set({
    frameworks: ['jasmine'],
    files: [
      //libs
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // src
      'src/**/module.js',
      'src/**/*Config.js',
      'src/**/*.js',
      /* Match all test files */
      'test/**/*.js'
    ],
    reporters : ['dots'],
    logLevel  : config.LOG_WARN,
    browsers  : ['PhantomJS'],
    singleRun : true
  });
};
