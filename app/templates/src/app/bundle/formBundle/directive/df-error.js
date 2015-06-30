/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfError', function (dfFormUtils) {
    return {
      restrict: 'EA',
      require: ['^?form', '^?ngModel'],
      scope: true,
      templateUrl: 'formBundle/templates/df-error.html',
      compile: function () {
        return {
          post: function post(scope, element, attrs, ctrl) {
            scope.errors = [];
            var ngmodel = ctrl[1] || {};
            var errorsCount = attrs.count || 1;
            if (attrs.forName && ctrl[0] && ctrl[0][attrs.forName]) {
              ngmodel = ctrl[0][attrs.forName];
            }

            scope.$watch(function () {
              var error = false;

              if (ngmodel.$invalid) {
                if (ngmodel.$dirty) {
                  error = true;
                } else if (ngmodel.$modelValue !== ('' || undefined) && ngmodel.$modelValue.length !== 0) {
                  error = true;
                }
              }

              return error;

            }, function (newVal) {
              if (newVal) {
                var errors = [];

                var i = 0;
                angular.forEach(ngmodel.$error, function (val, validatorName) {
                  if (i < errorsCount && !ngmodel.$errorMessages[validatorName]) {
                    i++;
                    errors.push(dfFormUtils.getMessageForError(validatorName));
                  }
                });
                angular.forEach(ngmodel.$errorMessages, function (msg) {
                  if (msg && i < errorsCount) {
                    i++;
                    errors.push(msg);
                  }
                });

                scope.errors = errors;
              } else {
                scope.errors = [];
              }

            });
          }
        };
      }
    };
  });
