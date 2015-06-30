/**
 * Created by Artyom on 2/12/2015.
 */
'use strict';
angular.module('df.formBundle')
  .directive('dfValidationGroup', function () {
    return {
      restrict: 'A',
      require: ['^form', '^ngModel'],
      link: function (scope, element, attrs, ctrls) {
        var ngForm = ctrls[0];
        var ngModel = ctrls[1];
        //todo allow arrays
        var groupName = attrs.dfValidationGroup;
        if (!groupName){
          return;
        }
        ngForm.$validationGroups = ngForm.$validationGroups || {};
        ngForm.$validationGroups[groupName] = ngForm.$validationGroups[groupName] || [];
        ngForm.$validationGroups[groupName].push(ngModel);

        ngModel.$validationGroup = groupName;
        scope.$on('$destroy', function(){
          console.log('todo remove from ngForm.validationGroups[groupName]');
          //todo remove from ngForm.validationGroups[groupName]
        });
      }

    };
  });
