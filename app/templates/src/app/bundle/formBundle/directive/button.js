/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
    .directive('dfButton', function () {
        return {
            restrict: 'E',
            require: '^?form',

            priority: -1,
            scope: {
                text: '@label',
                icon: '@?',
                iconSize: '@?',
                disableOnInvalid: '@?',
                classes: '@',
                ngDisabled: '='
            },
            templateUrl: function (element, attr) {
                return attr.icon ? 'formBundle/templates/df-icon-button.html' : 'formBundle/templates/df-button.html';
            },
            link: function (scope, element, attrs, formCtrl) {
                scope.iconSize = scope.iconSize || 24;
                scope.isDisabled = false;
                scope.buttonClass = [];
                scope.buttonClass.push('pp-btn');

                if (scope.classes) {
                    scope.buttonClass.push(scope.classes);
                }

                //var disabledParsed = $parse(attrs.ngDisabled);
                //scope.isDisabled = function () {
                //    return disabledParsed(scope.$parent);
                //};
                if (scope.$eval(attrs.primary)) {
                    scope.buttonClass.push('lgreen');
                }
                if (scope.$eval(attrs.warn)) {
                    scope.buttonClass.push('red');
                }
                if (scope.$eval(attrs.secondary)) {
                    scope.buttonClass.push('blue');
                }

                if (formCtrl && scope.disableOnInvalid) {
                    var model = formCtrl;
                    if (angular.isString(scope.disableOnInvalid) && formCtrl[scope.disableOnInvalid]) {
                        model = formCtrl[scope.disableOnInvalid];
                    }
                    scope.$watch(function () {
                        return model.$invalid;
                    }, function (val) {
                        scope.isDisabled = !!val;
                    });
                }

            }
        };
    });
