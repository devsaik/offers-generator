/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
angular.module('OfferBundle')
  .controller('OfferStatisticController', function ($scope) {
    //var vm = this;
    $scope.controls = {};
    if ($scope.ngDialogData && $scope.ngDialogData.statistic) {
      $scope.statistic_data = $scope.ngDialogData.statistic;
    }
    if ($scope.ngDialogData && $scope.ngDialogData.offer) {
      $scope.offer = $scope.ngDialogData.offer;
    }
    this.metrics = {
      views: {
        isActive: false,
        label: 'Views'
      },
      dailyClicks: {
        isActive: true,
        label: 'Clicks'
      },
      redemptions: {
        isActive: false,
        label: 'Redemtions'
      },
      revenue: {
        isActive: false,
        label: 'Sales'
      },
      dailySpend: {
        isActive: false,
        label: 'Spend'
      },
      dailyRoi: {
        isActive: false,
        label: 'ROI'
      }
    };
    this.onMetricChanged = function(x,y){
      $scope.controls.activeMetric = {x:x, y:y};
    };
    this.onFilterChanged = function(filter){
      $scope.controls.filter = filter;
    };
  });
