/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfDatepicker', function (dfFormUtils, $parse) {
    return {
      restrict: 'EA',
      require: ['^ngModel', '^?form', '^?dfField'],
      scope: {
        fid: '@?fid',
        tabindex: '@?',
        placeholder: '@?',
        value: '=ngModel',
        name: '@?',
        format: '@',
        initDate: '=?',
        minDate: '=?',
        maxDate: '=?'
      },
      templateUrl: 'formBundle/templates/df-datepicker.html',
      compile: function (element, attr) {
        if (angular.isUndefined(attr.fid)) {
          attr.fid = dfFormUtils.nextUid();
        }
        return {
          pre: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0];
            var form = ctrls[1];
            var disabledParsed = $parse(attrs.ngDisabled);
            ngModel.isDisabled = scope.isDisabled = function () {
              return (form && form.dfDisabled) || disabledParsed(scope.$parent);
            };
            scope.type = attrs.type || 'text';
            scope.name = scope.name || attrs.ngModel;
          },
          post: function (scope, element, attrs, ctrls) {
            angular.element(element).addClass('pp-datepicker');
            scope.options = {};
            scope.open = function ($event) {
              $event.stopPropagation();
              $event.preventDefault();
              if (scope.isDisabled()){
                return;
              }
              var datepicker = angular.element(element).find('datepicker')[0];
              var divs = angular.element(datepicker).find('div');

              angular.forEach(divs, function (e) {
                e = angular.element(e);
                if (e.hasClass('_720kb-datepicker-calendar')) {
                  e.toggleClass('_720kb-datepicker-open');
                }
              });
            };

            var dfField = ctrls[2];
            var ngModel = ctrls[0];
            if (dfField){
              dfField.onWidgetAdded(scope.fid, ngModel.$name, 'dfDatepicker');
            }
            dfFormUtils.applyValidation(ctrls[0], ctrls[1], scope);
          }
        };
      }
    };
  });
