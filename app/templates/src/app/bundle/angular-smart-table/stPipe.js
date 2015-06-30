'use strict';
angular.module('smart-table')
    .directive('stPipe', function () {
        return {
            require: 'stTable',
            scope: {
                stPipe: '='
            },
            link: {
                pre: function (scope, element, attrs, ctrl) {

                    if (angular.isFunction(scope.stPipe)) {
                        ctrl.preventPipeOnWatch();
                        ctrl.pipe = function () {
                            scope.stPipe(ctrl.tableState(), ctrl);
                        };
                    }
                }
            }
        };
    });
