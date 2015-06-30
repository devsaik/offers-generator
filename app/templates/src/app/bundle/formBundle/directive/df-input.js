/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfInput', function (dfFormUtils, $parse, $compile) {
    return {
      restrict: 'EA',
      require: ['^ngModel', '^?form', '^?dfField'],
      scope: {
        fid: '@?fid',
        ngModel: '=',
        type: '@?',
        //isDisabled: '=ngDisabled',
        tabindex: '@?',
        placeholder: '@?',
        symbol: '@?',
        inputValue: '@?',
        onFocus:'&',
        onBlur:'&'
      },
      templateUrl: function (element, attrs) {
        return attrs.hasOwnProperty('textarea') && attrs.textarea !== 'false' ? 'formBundle/templates/df-textarea.html' : 'formBundle/templates/df-input.html';
      },
      //templateUrl: 'formBundle/templates/df-input.html',
      compile: function (element, attr) {
        if (angular.isUndefined(attr.fid)) {
          attr.fid = dfFormUtils.nextUid();
        }
        return {
          pre: function (scope, element, attrs, ctrls) {
            var disabledParsed = $parse(attrs.ngDisabled);
            var ngModel = ctrls[0];
            var ngForm = ctrls[1];
            ngModel.isDisabled = scope.isDisabled = function () {
              return (ngForm && ngForm.dfDisabled) || disabledParsed(scope.$parent);
            };
            var type = attrs.type || 'text';
            scope.textarea = attrs.hasOwnProperty('textarea') && attrs.textarea !== 'false';
            if (!scope.textarea) {
              var inputVal = '';
              if (scope.inputValue) {
                inputVal = 'value="'+scope.inputValue+'"';
              }
              var inputHtml = '<input id="{{::fid}}" ' +
                'type="' + type + '"' +
                'ng-class="{symbol: symbol}" ' +
                'tabindex="{{::tabIndex}}" ' +
                'placeholder="{{::placeholder}}" ' +
                inputVal +
                'ng-model="ngModel" ' +
                'ng-focus="onFocus({$event:$event})"' +
                'ng-blur="onBlur({$event:$event})"' +
                'ng-model-options="{ updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0} }" ' +
                'ng-disabled="isDisabled()" ' +
                'ng-change="onValueChanged()"/>';

              $compile(angular.element(inputHtml))(scope, function (clonedElement) {
                angular.element(element).append(clonedElement);
              });
            }
            //angular.element(element).find('input').attr('type', scope.type);
            //scope.$watch('value', function (val) {
            //  ngModel.$setViewValue(val);
            //});
//						ctrl.$asyncValidators
          },
          post: function (scope, element, attrs, ctrls) {
            var dfField = ctrls[2];
            var ngModel = ctrls[0];
            if (dfField) {
              dfField.onWidgetAdded(scope.fid, ngModel.$name, 'dfInput');
            }
            dfFormUtils.applyValidation(ctrls[0], ctrls[1], scope);
          }
        };
      }
    };
  });
