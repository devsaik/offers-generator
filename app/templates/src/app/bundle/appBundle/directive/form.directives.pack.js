/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
/**
 * @module AppBundle
 * @description A pack of forms directives
 */
angular.module('AppBundle')

/**
 * @ngdoc directive
 * @name slickSlider
 * @restrict E
 * @description Simple slick slider
 * @param {int|string=}     attribute   The object to change. Should be refactored and converted into the ngModel
 * @param {string}          [min]       Minimal value
 * @param {string|object=}  [max]       Max Value
 * */
  .directive('rangeSlider', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        minValue: '=?',
        maxValue: '=',
        min: '@',
        max: '@',
        points: '=?',
        defaultValue: '@',
        measure: '@'
      },
      replace: true,
      templateUrl: 'app/bundle/appBundle/template/directive/slick-slider.tpl.html',
      link: function ($scope, element, attrs) {
        /**
         * Return value by proportional of whole
         * @param {number} proportion percent before multiplication by 100
         * @returns {float} real value
         */
        function getValueByProportion(proportion) {
          return proportion * ($scope.max - $scope.min) + parseInt($scope.min);
        }

        /**
         * Return percent ratio of value to range
         * @param {number} value
         * @returns {string} percent with '%' symbol
         */
        function getPercentByValue(value) {
          return (value - $scope.min) / ($scope.max - $scope.min) * 100 + '%';
        }

        var activePoint;
        var pointsWrap = element[0].querySelector('.points');
        $scope.automove = true;
        //default values
        $scope.measure = $scope.measure || 'km';
        $scope.min = parseInt($scope.min, 10) || 1;
        $scope.max = parseInt($scope.max, 10) || 9;
        $scope.defaultValueMax = parseInt($scope.defaultValueMax, 10) || 6;
        $scope.defaultValueMin = parseInt($scope.defaultValueMin, 10) || 6;
        $scope.realTimeValueMax = parseInt($scope.maxValue, 10) || $scope.defaultValueMax;
        $scope.realTimeValueMin = parseInt($scope.minValue, 10) || $scope.defaultValueMin;
        $scope.sliderPosition = {
          max: {},
          min: {}
        };
        function roundPosition() {
          var diff = $scope.max - $scope.min;
          var roundedValue = 0;
          var roundedPoint = 0;
          angular.forEach($scope.points, function (value, key) {
            if (Math.abs(value - parseFloat($scope.realTimeValueMax)) <= diff) {
              roundedValue = value;
              roundedPoint = key;
              diff = Math.abs(value - $scope.realTimeValueMax);
            }
          });
          $scope.realTimeValueMax = roundedValue;
          $scope.maxValue = roundedValue;
          activePoint = roundedPoint;
        }
        $scope.rullerInnerStyle = {
          left: 0,
          width: 0
        };
        if ($scope.points) {
          if ($scope.$eval(attrs.alwaysRound)){
            $scope.alwaysRound = true;
          }
          roundPosition();
        } else {
          $scope.minValue = $scope.realTimeValueMin;
          $scope.maxValue = $scope.realTimeValueMax;
        }
        $scope.initPoint = getPercentByValue;

        function roundToPoint(val, points){
          var roundedValue = 0;
          var roundedPoint = 0;
          var diff = $scope.max - $scope.min;
          angular.forEach(points, function (value, key) {
            if (Math.abs(value - parseFloat(val)) <= diff) {
              roundedValue = value;
              roundedPoint = key;
              diff = Math.abs(value - val);
            }
          });
          return {value: roundedValue, point: roundedPoint};
        }

        $scope.$watch('minValue', function (val) {
          if (val === undefined) {
            return;
          }
          if ($scope.minValue === $scope.max) {
            $scope.minValue -= 1;
            return;
          }
          if ($scope.maxValue !== undefined && $scope.minValue > $scope.maxValue) {
            $scope.maxValue = $scope.minValue + 1;
            return;
          }
          if ($scope.minValue < $scope.min) {
            $scope.minValue = $scope.min;
            return;
          }
          if ($scope.minValue > $scope.max) {
            $scope.minValue = $scope.max;
            return;
          }
          if ($scope.alwaysRound){
            $scope.minValue = roundToPoint($scope.minValue, $scope.points).value || $scope.minValue;
          }
          if ($scope.automove) {
            $scope.sliderPosition.min.left = getPercentByValue($scope.minValue);
          }
          var minValue = $scope.minValue ? $scope.minValue : $scope.min;
          $scope.rullerInnerStyle.left = getPercentByValue(minValue);
          $scope.rullerInnerStyle.width = getPercentByValue($scope.maxValue - minValue + parseInt($scope.min));
        });

        $scope.$watch('maxValue', function (val) {
          if (val === undefined) {
            return;
          }

          if ($scope.minValue !== undefined && $scope.maxValue === $scope.min) {
            $scope.maxValue += 1;
            return;
          }

          if ($scope.minValue !== undefined && $scope.maxValue < $scope.minValue) {
            $scope.minValue = $scope.maxValue - 1;
            return;
          }

          if ($scope.maxValue < $scope.min) {
            $scope.maxValue = $scope.min;
            return;
          }
          if ($scope.maxValue > $scope.max) {
            $scope.maxValue = $scope.max;
            return;
          }

          if ($scope.alwaysRound){
            $scope.maxValue = roundToPoint($scope.maxValue, $scope.points).value || $scope.maxValue;
          }

          if ($scope.automove) {
            $scope.sliderPosition.max.left = getPercentByValue($scope.maxValue);
          }

          var minValue = $scope.minValue !== undefined ? $scope.minValue : $scope.min;
          $scope.rullerInnerStyle.left = getPercentByValue(minValue);
          $scope.rullerInnerStyle.width = getPercentByValue($scope.maxValue - minValue + parseInt($scope.min));
        });

        $scope.moveSliderByOffset = function moveSliderByOffset(offset) {
          if ($scope.points) {
            if (activePoint + offset < 0 || activePoint + offset >= $scope.points.length) {
              return;
            }
            activePoint += offset;
            $scope.maxValue = $scope.points[activePoint];
          } else {
            $scope.maxLeft += offset * ($scope.max - $scope.min) / 10;
          }
        };


        $scope.moveSliderByClick = function moveSliderByClick(event) {
          if ($scope.minValue !== undefined) {
            return;
          }
          var clickX;
          switch (event.target.className) {
            case 'points': // click to wrap
              clickX = event.offsetX;
              break;
            case 'point': // click to point notch (click offset + notch offset)
              clickX = event.offsetX + event.target.offsetLeft;
              break;
            default: //click to point label (click offset + label offset + notch offset)
              clickX = event.offsetX + event.target.offsetLeft + event.target.parentElement.offsetLeft;
              break;
          }

          $scope.realTimeValue = getValueByProportion(clickX / pointsWrap.offsetWidth);
          roundPosition();
        };

        var startX;
        var startPosition;
        var mousedown;
        var activeSliderPointPoint;
        var sliderPoints = {
          min: element[0].querySelector('.slider-point.min'),
          max: element[0].querySelector('.slider-point.max')
        };
        var sliderBigWrap = element[0].querySelector('.slider-wrap');
        var sliderWrap = element[0].querySelector('.slider-point-wrap');
        sliderBigWrap.onmousedown = function preMoving($event) {
          $scope.automove = false;
          if ($scope.minValue !== undefined) {
            if ($event.target.classList.contains('min')) {
              activeSliderPointPoint = 'min';
              mousedown = true;
            } else if ($event.target.classList.contains('max')) {
              activeSliderPointPoint = 'max';
              mousedown = true;
            }
          } else {
            activeSliderPointPoint = 'max';
            mousedown = true;
          }
          startX = $event.clientX;
          startPosition = sliderPoints[activeSliderPointPoint].offsetLeft;
          $scope.$digest();
        };

        var valueTimeout;
        sliderBigWrap.onmousemove = function ($event) {
          if (!mousedown) {
            return;
          }
          var pos = (startPosition + ($event.clientX - startX)) / sliderWrap.offsetWidth * 100;
          if (pos > 100) {
            pos = 100;
          } else if (pos < 0) {
            pos = 0;
          }
          var rullerInnerLeft, rullerInnerWidth;
          $scope.sliderPosition[activeSliderPointPoint].left = pos + '%';
          if (activeSliderPointPoint === 'min') {
            rullerInnerLeft = pos + '%';
            rullerInnerWidth = parseInt(getPercentByValue($scope.maxValue)) - pos + '%';
          } else {
            rullerInnerLeft = getPercentByValue($scope.minValue);
            rullerInnerWidth = pos - parseInt(rullerInnerLeft) + '%';
          }

          $scope.rullerInnerStyle.left = rullerInnerLeft;
          $scope.rullerInnerStyle.width = rullerInnerWidth;

          if (valueTimeout) {
            $timeout.cancel(valueTimeout);
          }
          valueTimeout = $timeout(function () {
            $scope.realTimeValueMax = getValueByProportion(parseFloat($scope.sliderPosition.max.left) / 100);
            $scope.realTimeValueMin = getValueByProportion(parseFloat($scope.sliderPosition.min.left) / 100);
            $scope.minValue = $scope.minValue !== undefined ? $scope.realTimeValueMin : undefined;
            $scope.maxValue = $scope.realTimeValueMax;
          }, 300);
          $scope.$digest();
        };

        //$scope.moving = function moving($event) {
        //  if (!mousedown) {
        //    return;
        //  }
        //  var pos = (startPosition + ($event.clientX - startX)) / sliderWrap.offsetWidth * 100;
        //  if (pos > 100) {
        //    pos = 100;
        //  } else if (pos < 0) {
        //    pos = 0;
        //  }
        //  $scope.sliderPosition[activeSliderPointPoint].left = pos + '%';
        //  //$scope.realTimeValueMax = getValueByProportion(parseFloat($scope.sliderPosition.max.left) / 100);
        //  //$scope.realTimeValueMin = getValueByProportion(parseFloat($scope.sliderPosition.min.left) / 100);
        //  //$scope.minValue = $scope.minValue !== undefined ? $scope.realTimeValueMin : undefined;
        //  //$scope.maxValue = $scope.realTimeValueMax;
        //};

        var postMoving = function postMoving() {
          if (!mousedown) {
            return;
          }
          mousedown = false;
          $scope.automove = true;
          if ($scope.alwaysRound) {
            roundPosition();
          } else {
            $scope.minValue = $scope.minValue !== undefined ? Math.round($scope.realTimeValueMin) : undefined;
            $scope.maxValue = Math.round($scope.realTimeValueMax);
          }
          $scope.$digest();
        };

        sliderBigWrap.onmouseup = postMoving;

        sliderBigWrap.onmouseout = function ($event) {
          if ($event.target.classList.contains('slider-point-wrap') && !$event.toElement.classList.contains('slider-point')) {
            postMoving();
          } else {
            return false;
          }
        };
      }
    };
  })

;
