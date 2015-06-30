/**
 * Created by nilagor on 13.03.15.
 */
'use strict';
angular.module('AccountBundle')
  .directive('accountPlan', function (moment) {
    return {
      restrict: 'E',
      require: '^ngModel',
      templateUrl: 'app/bundle/accountBundle/template/directive/account-plan.tpl.html',
      scope: {
        plan: '=ngModel',
        plansParams: '=',
        switchPlan: '&onSwitch'
      },
      link: function (scope, element) {
        scope.$watch('plan.title', function(newPlanTitle){
          for (var plan in scope.plansParams) {
            if (!scope.plansParams.hasOwnProperty(plan)) {
              continue;
            }

            switch(plan.toLowerCase()) {
              case newPlanTitle:
                scope.currentPlan = scope.plansParams[plan];
                break;
              default:
                scope.anotherPlan = scope.plansParams[plan];
                break;
            }
          }
        });

        scope.getFormatDate = function getFormatDate(date) {
          return moment(date).format('MM-DD-YYYY');
        };

        scope.switchPlanHide = function(){
          scope.plan.view = false;
          scope.switchPlan();
        };

        angular.element(element).find('.switch-plan-block')
          .mouseenter(function(){
          $(this).find('.account-block').slideDown();
        });
      }
    };
  });
