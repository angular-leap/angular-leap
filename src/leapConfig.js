'use strict';

angular.module('angularLeap')
  .provider('leapConfig', function () {

    var _configFn,
      config = {
        defaultTimeout: 650,
        gestureIntense: 0.5
      };

    _configFn = function (map) {
      return angular.extend(config, map);
    };

    // Provider API
    this.config = function (map) {
      return _configFn(map);
    };

    this.$get = function () {
      // Service API
      return _configFn;
    };


  });
