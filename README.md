angular-leap
============
[![Build Status](https://travis-ci.org/angular-leap/angular-leap.png)](https://travis-ci.org/angular-leap/angular-leap)

# Angular + LeapMotion
Use your LeapMotion device in your AngularJS Application. 
Modify your Scopes via Gestures.
Easy to use.
Just in development.
Feel free to contribute or create feature requests ;)

## GestureEvent Directives

```html

<div ng-controller="ExampleCtrl">
	<div leap-swipe-left="a=a+1">Swipe Left => +1</div>
	<div leap-swipe-right="a=a+1">Swipe Left => +1</div>
	<div leap-swipe-up="a=a+10">Swipe Up => +10</div>
	<div leap-swipe-down="a=a-10">Swipe Down => -10</div>
	
	<div leap-circle="addByCircleSze($gesture)">Swipe Down => +%CicleSize%</div>
	
	<div leap-screentap="sqrt($gesture)">ScreenTap => sqrt</div>
	<div leap-keytap="pow2($gesture)">Swipe Down => power^%Hands%</div>
</div>
```

```js
angular.module("angular-leap-example")
    .controller("ExampleCtrl", function ($scope, leap) {
		$scope.a = 1;
        $scope.sqrt = function($gesture){
        	$scope.a = Math.sqrt($scope.a);
        };

        $scope.pow2 = function($gesture){
        	$scope.a = Math.pow($scope.a,$gesture.handIds.length+1);
        };
        
        $scope.addByCircleSze = function($gesture){
        //https://developer.leapmotion.com/documentation/Languages/JavaScript/API/Leap.CircleGesture.html
        }

    });
```

## TODO
* Build Process
* Reduce Redundant Code
* Documentation
* Examples
* Offer other events for easy usage

## Author
Robin Böhm (@roobijn)

