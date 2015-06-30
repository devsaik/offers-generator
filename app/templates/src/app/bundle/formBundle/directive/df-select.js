/**
 * Created by Artyom on 2/13/2015.
 */
/**
 * Created by Artyom on 2/12/2015.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfSelect', function (dfFormUtils, $parse) {
    return {
      restrict: 'E',
      require: ['^ngModel', '^?form', '^?dfField'],
      scope: {
        fid: '@?fid',
        value: '=ngModel',
        options: '=',
        name: '@?',
        tabindex: '@?'
      },
      templateUrl: 'formBundle/templates/df-select.html',
      link: function(scope, element, attrs, ctrl) {
        var dfField = ctrl[2];
        var ngModel = ctrl[0];

        var disabledParsed = $parse(attrs.ngDisabled);
        var ngForm = ctrl[1];
        ngModel.isDisabled = scope.isDisabled = function () {
          return (ngForm && ngForm.dfDisabled) || disabledParsed(scope.$parent);
        };

        if (dfField){
          dfField.onWidgetAdded(scope.fid, ngModel.$name, 'dfDatepicker');
        }
        dfFormUtils.applyValidation(ctrl[0], ctrl[1], scope);
      }
//      compile: function (element, attr) {
//        if (angular.isUndefined(attr.fid)) {
//          attr.fid = dfFormUtils.nextUid();
//        }
//        return {
//          pre: function (scope, element, attrs, ctrls) {
//            var ngModel = ctrls[0];
//            var form = ctrls[1];
//            var disabledParsed = $parse(attrs.ngDisabled);
//            scope.isDisabled = function () {
//              return disabledParsed(scope.$parent);
//            };
//            scope.type = attrs.type || 'text';
//            scope.name = scope.name || attrs.ngModel;
//
////						ctrl.$asyncValidators
//          },
//          post: function(scope, element, attrs, ctrls){
//            dfFormUtils.applyValidation(scope, ctrls[0], ctrls[1]);
//          }
//        };
//      }
    };
  });
