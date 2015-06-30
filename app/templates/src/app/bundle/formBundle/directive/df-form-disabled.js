/**
 * Created by nikita on 12/29/14.
 */
'use strict';
angular.module('df.formBundle')
    .directive('dfFormDisabled', function (dfFormUtils, $parse) {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, element, attrs, formCtrl) {
                attrs.$observe('dfFormDisabled', function(val){
                    formCtrl.dfDisabled = $parse(val)();
                });
            }
        };
    });
