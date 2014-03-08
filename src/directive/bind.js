'use strict';
angular.module('angularLeap')
  .directive('leapBind', function ($interval, leap) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {

        var updateRate = 50;
        if (angular.isDefined(attr.leapBindUpdateRate)) {
          updateRate = attr.leapBindUpdateRate;
        }


        // { sub: {id:1} } , ['sub','id']
        function getObjValueByArrayPath(object, pathArray) {
          var nextStep = pathArray.shift();

          if (!angular.isObject(object)) {
            return object;
          }
          if (!pathArray.length) {
            return object[nextStep];
          }
          return getObjValueByArrayPath(object[nextStep], pathArray);
        }

        /*
         getPathArrayFromString("this.is.a.sub.data[0].with[1].some.data")
         --> ["this", "is", "a", "sub", "data", "0", "with", "1", "some", "data"]

         Navigate to an object data via string from the directive.
         TODO: Not all cases are solved here. But it's okay for the first iteration
         */
        function getPathArrayFromString(pathAsString) {
          var pathAsArray = [];

          function removeEmptyFilter(element) {
            return element.length > 0;
          }

          // TODO: Solution that works for now, but not so readable. Improve
          pathAsString.
            split(/(\w*)\.?\[([\w\d]*)\]/)
            .filter(removeEmptyFilter)
            .map(function (e) {
              return e.split('.')
                .filter(removeEmptyFilter);
            })
            .forEach(function (element) {
              while (element.length) {
                pathAsArray.push(element.shift());
              }
            });
          return pathAsArray;
        }

        function update() {
          var configObj = scope.$eval(attr.leapBind);
          if (angular.isObject(configObj)) {
            angular.forEach(configObj, function (v, k) {
              scope[k] = getObjValueByArrayPath(leap.getLastFrame(), getPathArrayFromString(v));
            });
          }
        }


        update();
        $interval(update, updateRate);
      }
    };
  });

