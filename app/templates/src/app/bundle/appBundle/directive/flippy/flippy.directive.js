/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';
angular.module('AppBundle')
  .directive('flippy', function() {
    return {
      restrict: 'C',
      scope: {isFlipped: '='},
      link: function(scope, elem, attrs) {
//        elem.addClass('flippy-card');

        scope.$watch('isFlipped', function(val){
          if(val){
            elem.addClass('flipped');
          }else{
            elem.removeClass('flipped');
          }
        });
        /**
         * behaviour for flipping effect.
         */
        var flip = function() {
          elem.toggleClass('flipped');
        };

        if (attrs.clickToggle && JSON.parse(attrs.clickToggle)) {
          elem.bind('click', flip);
        }
        if (attrs.mouseoverToggle && JSON.parse(attrs.mouseoverToggle)) {
          elem.bind('mouseenter', flip);
          elem.bind('mouseleave', flip);
        }

      }
    };
  });
