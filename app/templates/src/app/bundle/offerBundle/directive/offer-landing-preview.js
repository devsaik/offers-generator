/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';

  angular.module('OfferBundle')
    .directive('offerLandingPreview', function (appConfig) {
      return {
        restrict: 'A',
        scope: {
          offer: '=',
          placeholders: '='
        },
        template: '<div ui-scroll class="h100" ng-include="landingUrl"></div>',
        link: function (scope, element, attrs) {
          scope.autoRestrictionMessage = appConfig.ENTITY.offer.autoRestrictionMessage;
          scope.landingUrl = 'app/bundle/offerBundle/template/landing/' + attrs.type + '.tpl.html';
          attrs.$observe('attrs.type', function (v) {
            if (!v) {
              return;
            }
            scope.landingUrl = 'app/bundle/offerBundle/template/landing/' + v + '.tpl.html';
          });
        }
     };
    });
