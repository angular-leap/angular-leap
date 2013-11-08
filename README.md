angular-leap
============
[![Build Status](https://travis-ci.org/angular-leap/angular-leap.png)](https://travis-ci.org/angular-leap/angular-leap)

# Angular + LeapMotion
Use your LeapMotion device in your AngularJS Application. 
Modify your Scopes via Gestures.
Easy to use.
Just in development.
Feel free to contribute or create feature requests ;)

## Bower

bower install angular-leap

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
        
        $scope.addByCircleSize = function($gesture){
            $scope.a = $scope.a + $gesture.radius;
        }

    });
```

## Release History
* 0.0.1 - Add simple gesture directives (swipe-*, circle, *-tap)

## Deployed Example
[angular-leap-instant.herokuapp.com](https://angular-leap-instant.herokuapp.com/)

## Example Video
[Screencast Demo](http://www.youtube.com/watch?v=RrszTInvJA4&feature=youtu.be)

## TODO
* Reduce Redundant Code
* Documentation
* Offer other events for easy usage

## Contributors
* Robin Böhm (@roobijn)
* Pascal Precht (@PascalPrecht)

