/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
  .directive('validationRules', function () {
    return {
      restrict: 'EA',
      require: '^form',
      scope: {
        object: '=',
        rules: '=validationRules'
      },
      link: function post(scope, element, attrs, ctrl) {
        ctrl.validationRules = scope.rules;// scope.$eval(attrs.);
        //ctrl.object = scope[attrs.object];
        scope.$watch('object', function(val){
          ctrl.object = val;
        });
      }
    };
  });
