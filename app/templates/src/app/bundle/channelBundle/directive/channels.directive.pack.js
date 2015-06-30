'use strict';
angular.module('ChannelBundle')
  .directive('iabCategories', function (ppApiTools, notify) {
    return {
      restrict: 'E',
      templateUrl: 'app/bundle/channelBundle/template/directive/iab-categories.tpl.html',
      scope: {
        values: '=ngModel'
      },
      controllerAs: 'vm',
      controller: function ($scope) {
        ppApiTools.getIABCategories()
          .then(function (cat) {

            var parents = _.filter(cat, function (obj) {
              if (!obj.parentCode) {
                return obj;
              }
            });

            var data = _.each(parents, function (obj) {
              obj.list = _.filter(cat, function (objs) {
                if (objs.parentCode === obj.code) {
                  return objs;
                }
              });
            });

            //$scope.iab_categories = cat.data;
            $scope.iab_categories = data;
          }).catch(function (e) {
            notify.warning('Warning', e.message);
          });
      }
    };
  })

  .directive('targetCategories', function (ppApiTools, notify) {
    return {
      restrict: 'E',
      templateUrl: 'app/bundle/channelBundle/template/directive/target-categories.tpl.html',
      scope: {
        values: '=ngModel'
      },
      controllerAs: 'vm',
      controller: function ($scope) {
        ppApiTools.getTargetedCategories()
          .then(function (cat) {
            $scope.targeted_categories = cat;
          }).catch(function (e) {
            notify.warning('Warning', e.message);
          });
      }
    };
  })
  // stupid name, i know
  .directive('multiRadioList', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/bundle/channelBundle/template/directive/multi-radio-list.tpl.html',
      scope: {
        values: '=ngModel',
        options: '='
      }
    };
  })
  .directive('radioGroup', function (){
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/bundle/channelBundle/template/directive/radio-group.tpl.html',
      scope: {
        model: '=ngModel',
        options: '=',
        name: '@'
      }
    };
  })
  .directive('advancedTargeting', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/bundle/channelBundle/template/directive/advanced-targeting.tpl.html',
      scope: {
        values: '=ngModel',
        maps: '=options'
      },
      controllerAs: 'vm',
      link: function (scope, element) {
        scope.$watch('values', function(val){
          if (!val || !val.length || val[0] === '') {
            val[0] = '';
            angular.element(element).addClass('placeholder');
          } else {
            angular.element(element).removeClass('placeholder');
          }
        });
      }
    };
  })

  .directive('adPreviewPopup',
  /**
   *
   * @param appConfig
   * @param {Channels} channels
   * @returns {{restrict: string, templateUrl: string, scope: {image: string, type: string}, link: Function}}
   */
  function (appConfig, channels) {
    return {
      restrict: 'E',
      templateUrl: 'app/bundle/channelBundle/template/directive/ad-preview-popup.tpl.html',
      scope: {
        image: '=',
        type: '='
      },
      link: function (scope) {
        var options = channels.getProvider('display').getConfig().form.preview.options[scope.type] || {
            unsupported: true
          };

        scope.options = {
          unsupported: options.unsupported,
          bg: options.bg,
          width: options.width,
          height: options.height
        };
      }
    };
  });
