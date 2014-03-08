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

      var listeners;

      var listener = function (gesture) {
        var movement,
          listenerKey = 'leap' + gesture.type;

        if (gesture.type === 'circle') {
          movement = leapFn.circleMovement(gesture);
          // direction
          listenerKey += movement.type?movement.type:'';
        }
        else if (gesture.type === 'swipe') {
          movement = leapFn.swipeMovement(gesture);
          // direction
          listenerKey += movement.type?movement.type:'';
        }
        else if (gesture.type === 'screenTap') {
          movement = gesture;
        }
        else if (gesture.type === 'keyTap') {
          movement = gesture;
        }


        if (movement) {
          angular.forEach(listeners[listenerKey.toLocaleLowerCase()], function (listenerFn) {
            listenerFn(gesture,movement);
          });
        }
      };

      var _onGesture = function (eventName, fn) {
        eventName = eventName.toLowerCase();
        if (!listeners) {
          listeners = {};
          _controllerFn($window).on('gesture', listener);
        }

        if (listeners[eventName] instanceof Array) {
          listeners[eventName].push(fn);
        }
        else {
          listeners[eventName] = [fn];
        }
      };


      // Service API
      return {
        controller: function () {
          return _controllerFn($window);
        },
        getLastFrame: function () {
          return _controllerFn($window).frame();
        },
        fn: leapFn,
        config: leapConfig,
        onGesture: _onGesture,
        _listeners: listeners
      };
    };

  })
;
