describe('A leap-bind directive', function () {
  'use strict';

  beforeEach(module('angularLeap'));

  var $rootScope,
    $compile,
    leap,
    _Leap,
    _LeapController;

  beforeEach(inject(function ($window) {
    _LeapController = function () {};
    _LeapController.prototype.connect = function () {};


    _Leap = function () {};
    _Leap.Controller = _LeapController;

    $window.Leap = _Leap;
  }));

  beforeEach(inject(function (_$rootScope_, _$compile_, _leap_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    leap = _leap_;
  }));

  it('should bind leap-frame-values to the scope', inject(function ($interval) {
    var html = '<div leap-bind="{value: \'id\'}">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {id: 1};
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('1');
  }));


  it('should update in after a 50ms interval as default', inject(function ($interval) {
    var html = '<div leap-bind="{value: \'id\'}">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {id: 1};
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('1');

    lastFrame.id = 2;

    $interval.flush(50);
    expect(element.text()).toBe('2');
  }));


  it('should set update-rate via attribute', inject(function ($interval) {
    var html = '<div leap-bind="{value: \'id\'}" leap-bind-update-rate="1000">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {id: 1};
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('1');

    lastFrame.id = 2;

    $interval.flush(999);
    expect(element.text()).toBe('1');

    $interval.flush(1);
    expect(element.text()).toBe('2');


  }));


  it('should bind sub-object values', inject(function () {
    var html = '<div leap-bind="{value: \'sub.sub.id\'}">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {
      sub: {
        sub: {
          id: 3
        }
      }
    };
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('3');
  }));

  it('should not throw a exception on non-existing values', function () {
    var html = '<div leap-bind="{value: \'sub.sub.sub.id\'}">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {};
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('');
  });


  it('should allow the array notation for selecting values', function () {
    var html = '<div leap-bind="{value: \'hands[0].palmPosition[2]\'}">{{value}}</div>';
    var scope = $rootScope.$new();

    var lastFrame = {
      hands: [
        {
          palmPosition: [1, 2, 3]
        }
      ]
    };
    spyOn(leap, 'getLastFrame').andReturn(lastFrame);


    var element = $compile(html)(scope);
    scope.$apply();

    expect(element.text()).toBe('3');
  });


});
