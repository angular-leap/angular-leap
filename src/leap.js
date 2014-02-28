'use strict';

angular.module('angularLeap')
  .provider('leap', function (leapConfigProvider) {

    var controller,
      _controllerFn;

    _controllerFn = function ($window) {
      if (!controller) {
        controller = new $window.Leap.Controller({enableGestures: true});
        controller.connect();
      }
      return controller;
    };

    // Provider API
    this.config = leapConfigProvider;

    this.$get = function ($window, leapConfig, leapFn) {
      if (!$window.Leap) {
        throw new Error('You should include LeapJS Native JavaScript API');
      }
      // Service API
      return {
        controller: function () {
          return _controllerFn($window);
        },
        getLastFrame: function () {
          return _controllerFn($window).frame();
        },
        fn: leapFn,
        config: leapConfig

      };
    };

  });
