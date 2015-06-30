/**
 * Created by Artyom on 2/12/2015.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfLabel', function () {
    return {
      restrict: 'E',
      require: '^form',
      scope: {
        required: '@',
        label: '@',
        tooltip: '@',
        tooltipPosition: '@',
        forAttr: '@for'
      },
      templateUrl: 'formBundle/templates/df-label.html',
      link: function (scope) {
        scope.position = function (position) {
          if (position && position === 'right') {
            return 'right';
          }
        };
      }
    };
  });
