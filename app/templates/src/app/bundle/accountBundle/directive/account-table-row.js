/**
 * Created by Artyom on 3/24/2015.
 */
'use strict';

angular.module('AccountBundle')
  .directive('accountTableRow', function (moment) {
    return {
      restrict: 'AE',
      templateUrl: 'app/bundle/accountBundle/template/directive/account-table-row.tpl.html',
      scope: {
        user: '='
      },
      link: function(scope, element) {
        angular.element(element).addClass('table-row');
        scope.toogleDropdown = function(){
          if(!scope.user.active){
            scope.user.active = true;
          }
          else{
            scope.user.active = false;
          }
        };
        scope.getFormatDate = function getFormatDate(date) {
          return moment(date).format('MM-DD-YYYY');
        };
      }
    };
  });
