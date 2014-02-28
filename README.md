angular-leap
============
[![Build Status](https://travis-ci.org/angular-leap/angular-leap.png)](https://travis-ci.org/angular-leap/angular-leap)
[![Dependency Status](https://david-dm.org/angular-leap/angular-leap.png)](https://david-dm.org/angular-leap/angular-leap)
[![devDependency Status](https://david-dm.org/angular-leap/angular-leap/dev-status.png)](https://david-dm.org/angular-leap/angular-leap#info=devDependencies)

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
	<div leap-swipe-forward="a=a*a">Swipe Forward => a^2</div>
	<div leap-swipe-backward="a=a/2">Swipe Backward => a/2</div>
	
	<div leap-circle="addByCircleSze($gesture)">Circle => +%CicleSize%</div>
	<div leap-circle-clockwise="addByCircleSze($gesture)">Circle clockwise => +%CicleSize%</div>
	<div leap-circle-counter-clockwise="addByCircleSze($gesture)">Circle counter-clockwise => +%CicleSize%</div>
	
	<div leap-screentap="sqrt($gesture)">ScreenTap => sqrt</div>
	<div leap-keytap="pow2($gesture)">Swipe Down => power^%Hands%</div>


    <!-- Bind frame values to the scope (default 50ms) -->
	<div leap-bind="{hands: 'hands'}" style="position:absolute;left:{{hands[0].palmPosition[0]}}px">{{hands[0].palmPosition[0]}}</div>

	<!-- Bind frame values to the scope all 1000ms via attribute config -->
    <div leap-bind="{hands: 'hands'}"
         leap-bind-update-rate="1000"
         style="position:absolute;left:{{hands[0].palmPosition[0]}}px">{{hands[0].palmPosition[0]}}</div>


     <div leap-bind="{x: 'hands[0].palmPosition[0]'}"
          leap-bind-update-rate="1000"
          style="position:absolute;left:{{x}}px">{{x}}</div>

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
[Changelog](https://github.com/angular-leap/angular-leap/blob/master/CHANGELOG.md)

## Deployed Example
[angular-leap-instant.herokuapp.com](https://angular-leap-instant.herokuapp.com/)

## Example Video
[Screencast Demo](http://www.youtube.com/watch?v=RrszTInvJA4&feature=youtu.be)

## TODO
* Documentation
* Offer other events for easy usage

## Contributors
* Robin Böhm (@roobijn)
* Pascal Precht (@PascalPrecht)



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/angular-leap/angular-leap/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

