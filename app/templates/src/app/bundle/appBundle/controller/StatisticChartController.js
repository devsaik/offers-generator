'use strict';
angular.module('AppBundle')
.controller('AppBundle.StatisticChartController', function($scope, moment){

    var vm = this;
    var total;
    $scope.statistic_data = $scope.statistic_data || {};
    $scope.metrics = $scope.metrics || {};
    var tmp = Object.keys($scope.metrics);
    if (tmp.length === 0){
      throw new Error('Metrics is required for this directive');
    }
    $scope.activeMetrics = {
      x: {name: tmp[0], label: $scope.metrics[tmp[0]].label},
      y: {name: tmp[0], label: $scope.metrics[tmp[0]].label}
    };

    /* get parameters name */
    $scope.nameKeys = [];

    for (var i in $scope.statistic_data.params) {
      if (!$scope.statistic_data.params.hasOwnProperty(i)) {
        continue;
      }
      $scope.nameKeys.push(i);
    }

    /* bild graph with all parameters */
    //$scope.data = getItem($scope.statistic_data.params);


    function getItem(params) {
      var stats = _.keys(params);

      /* dynamic settings */
      var setups = {};

      /* insert data in cols */
      setups.cols = [
        {
          'id': 'days',
          'label': 'Days',
          'type': 'string',
          'p': {}
        }
      ];

      for (var i = 0; i < stats.length; i++) {
         total = params[stats[i]].total;

        setups.cols.push({
          'id': stats[i],
          'label': 'value',
          'type': 'number',
          'p': {}
        });
      }

      /* insert data in rows */
      var datesArray = [];
      setups.rows = [];

      datesArray = _.keys(params[stats[0]].info);

      datesArray.sort(function (a, b) {
        if (a > b) {
          return 1;
        }
        return a < b ? -1 : 0;
      });
      function getDateValues(date, params) {
        var items = _.keys(params);
        var rowObj = {};
        rowObj.c = [];
        rowObj.c.push({v: moment(date).format('MMM DD, YYYY')});

        for (var i = 0; i < _.keys(params).length; i++) {
          rowObj.c.push({v: params[items[i]].info[date]});
        }

        return rowObj;
      }
      for (var j = 0; j < datesArray.length; j++) {
        setups.rows.push(getDateValues(datesArray[j], params));
      }

      /* default settings */
      var showEveryN = 1;
      if (4 < datesArray.length && datesArray.length < 8) {
        showEveryN = 2;
      }
      else if (8 < datesArray.length && datesArray.length < 12) {
        showEveryN = 3;
      }
      else if (12 < datesArray.length) {
        showEveryN = 4;
      }

      var obj = {
        'type': 'LineChart',
        'displayed': true,
        'smoothLine': true,
        'options': {
          'legend': 'none',
          'pointSize': 7,
          'colors': ['#1CAEE2'],
          'width': 700,
          'height': 280,
          'lineWidth': 3,
          'isStacked': 'false',
          'curveType': 'none', // change to 'function' for smooth lines
          'displayExactValues': true,
          'chartArea': {
            'width': 610,
            'height': 220
          },
          'hAxis': {
            'showTextEvery': showEveryN
          },
          'vAxis': {
            'gridlines': {
              'count': 5,
              'format': 'short',
              textPosition: 'in'
            },
            'viewWindowMode': 'pretty',
            'viewWindow': {
              'min': total < 0 ? 'auto' : 0
            }
          }
        }

      };

      /* get value for rows */


      obj.data = setups;
      return obj;
    }

    this.updateChartData = function (activeMetrics) {
      delete $scope.data;
      $scope.onMetricChanged(activeMetrics);

      var params = {
        info: {},
        total: 0
      };
      //for (var key in $scope.metrics) {
      //  if ($scope.metrics.hasOwnProperty(key) && $scope.metrics[key].isActive) {
      //    params[key] = $scope.statistic_data.params[key];
      //  }
      //}
      if (!$scope.statistic_data.params){
        return;
      }
      var xMetricsData = $scope.statistic_data.params[$scope.activeMetrics.x.name];
      var yMetricsData = $scope.statistic_data.params[$scope.activeMetrics.y.name];

      for (var key in xMetricsData.info) {
        if (!xMetricsData.info.hasOwnProperty(key)) {
          continue;
        }
        if (!yMetricsData.info[key] || yMetricsData.info[key] === 0) {
          params.info[key] = 0;
        } else if (yMetricsData.info[key] === xMetricsData.info[key]) {
          params.info[key] = xMetricsData.info[key];
        } else {
          params.info[key] = xMetricsData.info[key] / yMetricsData.info[key];
        }
        params.total += params.info[key];
      }

      $scope.data = getItem({stats: params});
    };
    this.toggleMetricY = function (metricName) {
      $scope.activeMetrics.y.name = metricName;
      $scope.activeMetrics.y.label = $scope.metrics[metricName].label;
      this.updateChartData($scope.activeMetrics);
    };
    this.toggleMetricX = function (metricName) {
      $scope.activeMetrics.x.name = metricName;
      $scope.activeMetrics.x.label = $scope.metrics[metricName].label;
      this.updateChartData($scope.activeMetrics);
    };
    this.setChartData = function(data){
      $scope.statistic_data = data;
    };

    $scope.$watch('statistic_data', function(){
      vm.updateChartData($scope.activeMetrics);
    });

    this.updateChartData($scope.activeMetrics);
  });
