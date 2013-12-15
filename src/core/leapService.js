'use strict';
/**
 * @ngdoc object
 * @name angularLeap.leapProvider
 *
 * @description
 * The `leapProvider` provides an interface to configure `leap` service for the
 * runtime. For example, if you build an application with leap motion and you only
 * want to support one leap controller instance instead of more then one (which is
 * possible but not the usual case), you can use `leapProvider` to configure a default
 * controller instance for your application. You can then access this particular
 * controller instance via `leap.controller()`.
 */

/**
 * @ngdoc function
 * @name angularLeap.leapProvider.controllerConfig
 * @methodOf angularLeap.leapProvider
 *
 * @description
 *
 * @param {object} configuration A configuration object that can have the following
 * possible options:
 *
 * - host - The websocket host
 * - port - The port to listen to
 * - enableGesture - Can be `true` or `false`
 * - frameEventName - The default frame event name you want to rely on
 *
 * This interface is just an adaption of the LeapJS SDK which sits below angular-leap.
 * Please check out their docs for more information on controller instances.
 */
angular.module('angular-leap').service('leap', function ($window) {
  if (!$window.Leap) {
    throw new Error('You should include LeapJS Native JavaScript API');
  }

  var controller;

  var getController = function () {
    if (!controller) {
      controller = new $window.Leap.Controller({enableGestures: true});
      controller.connect();
    }
    return controller;
  };

  return {
    controller: getController
  };
});
