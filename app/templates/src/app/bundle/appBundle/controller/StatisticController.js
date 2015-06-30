/**
 * Created by nikita on 5/20/15.
 */
'use strict';
angular.module('AppBundle')
  .controller('AppBundle.StatisticController', function ($scope, moment) {
    var vm = this;
    var registeredChartsControllers = [];
    $scope.statistic_data = $scope.statistic_data || {};
    this.defaultData = angular.copy($scope.statistic_data);

    $scope.options = $scope.options || {
      fromDate: moment().startOf('month').format('YYYY/MM/DD'),
      toDate: moment().endOf('month').format('YYYY/MM/DD')
    };

    $scope.onMetricChanged = function (x, y) {
      $scope.currentMetric = {x: x, y: y};
    };

    this.filtersPreDefinedDates = {
      promotion: {
        fromDate: moment(new Date($scope.options.fromDate)).format('YYYY/MM/DD'),
        toDate: moment(new Date($scope.options.toDate)).format('YYYY/MM/DD')
      },
      week: {
        fromDate: moment().startOf('week').format('YYYY/MM/DD'),
        toDate: moment().endOf('week').format('YYYY/MM/DD')
      },
      month: {
        fromDate: moment().startOf('month').format('YYYY/MM/DD'),
        toDate: moment().endOf('month').format('YYYY/MM/DD')
      },
      custom: {
        fromDate: moment(new Date($scope.options.fromDate)).format('YYYY/MM/DD'),
        toDate: moment(new Date($scope.options.toDate)).format('YYYY/MM/DD')
      }
    };

    function applyFilter(filter, data) {
      var from = moment(filter.fromDate, 'YYYY/MM/DD');
      var to = moment(filter.toDate, 'YYYY/MM/DD');
      var processed = {};
      var keys = Object.keys(data.params);
      var range = moment().range(from, to);

      angular.forEach(keys, function (metricName) {
        processed[metricName] = angular.copy(data.params[metricName]);

        var metricData = processed[metricName].info;
        processed[metricName].info = {};
        var dates = Object.keys(metricData);
        var total = 0;

        angular.forEach(dates, function (dateKey) {
          var date = moment(dateKey);
          if (range.contains(date, true)) {
            var val = parseFloat(metricData[dateKey]);
            val =  angular.isNumber(val) ? parseFloat(val.toFixed(2)) : metricData[dateKey];
            processed[metricName].info[dateKey] = val;
            total += metricData[dateKey];
          }
        });
        processed[metricName].total = total;
      });
      data.params = processed;
      return data;
    }

    this.apply = function (type) {
      if (!type || !vm.filtersPreDefinedDates[type]) {
        return;
      }
      vm.filtersPreDefinedDates.custom = vm.filtersPreDefinedDates[type];
      $scope.controls.filter = vm.filtersPreDefinedDates[type];
      $scope.statistic_data = applyFilter($scope.controls.filter, angular.copy(vm.defaultData));

      $scope.onFilterChanged({filter: angular.extend({type: type}, $scope.controls.filter)});
      angular.forEach(registeredChartsControllers, function (controller) {
        if (angular.isFunction(controller.setChartData)) {
          controller.setChartData($scope.statistic_data);
        }
      });
    };

    this.addChart = function (chart) {
      registeredChartsControllers.push(chart);
    };

    this.removeChart = function (chart) {
      registeredChartsControllers = _.without(registeredChartsControllers, chart);
    };

    $scope.controls = {
      filter: this.filtersPreDefinedDates.promotion,
      filterType: 'promotion'
    };

    $scope.$watch('controls.filterType', function (type) {
      vm.apply(type);
    });
  });
