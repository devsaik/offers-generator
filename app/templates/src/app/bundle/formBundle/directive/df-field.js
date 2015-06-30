/**
 * Created by Artyom on 2/16/2015.
 */
'use strict';
angular.module('df.formBundle')
  .controller('df.formBundle')
  .directive('dfField', function () {
    return {
      restrict: 'E',
      transclude: true,
      require: ['^?form', 'dfField'],
      scope: false,
      templateUrl: 'formBundle/templates/df-field.html',
      compile: function () {
        return {
          post: function (scope, element, attrs, ctrls, transclude) {
            var e = angular.element(element).find('widget');
           // var vm = ctrls[1];
            transclude(scope, function (clone) {
              //vm.label = attrs.label;
              //vm.tooltip = attrs.tooltip;
              //vm.required = attrs.required;
              e.append(clone);
            });
          }
        };

      },
      controller: function ($scope, $element, $attrs, $compile, $interpolate,$templateCache) {
        this.onWidgetAdded = function (fid, name) {
          this.fid = fid;
          this.field_name = name;
          //add error element
          $compile(angular.element('<df-error for-name="'+name+'"></df-error>'))($scope, function(clonedElement) {
            angular.element($element).append(clonedElement);
          });
          //add label
          if ($attrs.label){
            var template = $interpolate($templateCache.get('formBundle/templates/df-field-label.html'))({label: $attrs.label, tooltip: $attrs.tooltip, tooltipPosition: $attrs.tooltipPosition, required: $attrs.required, fid: fid, name: name});
            $compile(angular.element(template))($scope, function(labelElement){
              angular.element($element).prepend(labelElement);
            });
          }


        };
      }
    };
  });
