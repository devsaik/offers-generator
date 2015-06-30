/**
 * Created by nikita on 5/20/15.
 */
'use strict';
angular.module('AppBundle')
  .directive('statisticChartControl', function(){
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        statistic_data: '=statisticData',
        options: '=',
        onFilterChanged: '&'
      },
      templateUrl: 'app/bundle/appBundle/template/directive/statistic-chart-control.tpl.html',
      controller: 'AppBundle.StatisticController as vm'
    };
  })

  .directive('statisticChart', function(){
    return {
      restrict: 'E',
      require: ['statisticChart','^?statisticChartControl'],
      scope: {
        offer: '=',
        metrics: '=',
        onMetricChanged: '&'
      },
      templateUrl: 'app/bundle/appBundle/template/directive/statistic-chart.tpl.html',
      controller: 'AppBundle.StatisticChartController as vm',
      link: function pre (scope, element, attrs, ctrls){
        var statisticChart = ctrls[0];
        var statisticChartController = ctrls[1];
        scope.statistic_data = statisticChartController.defaultData;
        statisticChartController.addChart(statisticChart);
        scope.$on('$destroy', function () {
          statisticChartController.removeChart(statisticChart);
        });

      }
    };
  });
