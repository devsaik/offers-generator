/**
 * @module AppBundle
 * @description A pack of stTable directives which add or override default features
 */
'use strict';
angular.module('AppBundle')
/**
 * @ngdoc directive
 * @name stFilter
 * @requires stTable
 * @restrict E
 * @description Custom stFilter
 * @param {object=}         model           Filter criteria
 * @param {string}          [predicate]     predicate @see oficial documentation and post link here
 * */
  .directive('stFilter', ['$timeout', function ($timeout) {
    return {
      require: '^stTable',
      scope: {
        model: '=stFilter',
        predicate: '=?predicate'
      },
      link: function (scope, element, attr, ctrl) {
        var tableCtrl = ctrl;
        var promise = null;
        var throttle = attr.stDelay || 400;

        scope.$watch('predicate', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            ctrl.tableState().search = {};
            tableCtrl.search(element[0].value || '', newValue);
          }
        });

        //table state -> view
        scope.$watch(function () {
          return ctrl.tableState().search;
        }, function (newValue) {
          var predicateExpression = scope.predicate || '$';
          if (newValue.predicateObject && newValue.predicateObject[predicateExpression] !== element[0].value) {
            element[0].value = newValue.predicateObject[predicateExpression] || '';
          }
        }, true);

        // view -> table state
        scope.$watch('model', function (val) {
          if (!val || promise !== null) {
            $timeout.cancel(promise);
          }
          promise = $timeout(function () {
            tableCtrl.search(val, scope.predicate || '');
            promise = null;
          }, throttle);
        });
      }
    };
  }])

/**
 * @ngdoc directive
 * @name stGroupBy
 * @requires stTable
 * @restrict E
 * @description Group items after sorting
 * @param {string}           groupBy         field name
 * @param {string[]}         [groupOrder]    group order array
 * */
  .directive('stGroupBy', function ($timeout, $filter, moment) {
    return {
      require: '^stTable',
      scope: {
        groupBy: '=stGroupBy',
        sortBy: '@',
        groupOrder: '=?',
        onGroupingDone: '&'
      },
      link: function (scope, element, attr, ctrl) {
        ctrl.setSortFunction(function(filtered, predicate, reverse){
          filtered = $filter('orderBy')(filtered, function(o){
            try {
              return moment(o[predicate]).unix();
            } catch(e){
              return o[predicate];
            }
          }, reverse);
          if (scope.groupOrder && scope.groupOrder.length > 0 ){
            var grouped = _.groupBy(filtered ,scope.groupBy);
            //var f = filtered;
            filtered = [];
            var keyOrder = _.uniq(scope.groupOrder.concat(_.keys(grouped)));
            angular.forEach(keyOrder, function(key){
              if (grouped[key]){
                filtered = filtered.concat(grouped[key]);
              }
            });
          }
          $timeout(function(){
            scope.onGroupingDone(filtered);
          }, 10);
          return filtered;
        });


//        scope.$watch('predicate', function (newValue, oldValue) {
//          if (newValue !== oldValue) {
//            ctrl.tableState().groupBy = {};
//            tableCtrl.groupBy(element[0].value || '', newValue);
//          }
//        });
      }
    };
  });
