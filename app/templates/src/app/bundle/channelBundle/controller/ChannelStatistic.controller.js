/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
  angular.module('ChannelBundle')
    .controller('ChannelStatisticController', function ($scope) {
      if ($scope.ngDialogData && $scope.ngDialogData.statistic.type !== 'error') {
        var statChannel = $scope.ngDialogData.statistic.channel;
        var statAd = $scope.ngDialogData.statistic.ad || {};
        $scope.channel_statistic = statChannel;
        angular.extend($scope.channel_statistic, statAd);
        $scope.channel_statistic = {
          params: $scope.channel_statistic
        };
      } else {
        $scope.noData = true;
      }
      $scope.offer = $scope.ngDialogData.offer;
      $scope.controls = {};

      this.onMetricChanged = function(x,y){
        $scope.controls.activeMetric = {x:x, y:y};
      };
      this.onFilterChanged = function(filter){
        $scope.controls.filter = filter;
      };

      this.metrics = {
        //channel metrics
        dailyRoi: {
          isActive: false,
          label: 'ROI'
        },
        dailyCvr: {
          isActive: false,
          label: 'CVR'
        },
        dailyECpc: {
          isActive: false,
          label: 'eCPC'
        },
        dailyECpa: {
          isActive: false,
          label: 'eCPA'
        },
        dailyECpm: {
          isActive: false,
          label: 'eCPM'
        },
        dailyNetRevenue: {
          isActive: false,
          label: 'Net Revenue'
        },
        dailySpend: {
          isActive: false,
          label: 'Spend'
        }
      };

      if ($scope.channel_statistic.hasOwnProperty('dailyImpressions')) {
        var adMetrics = {
          dailyImpressions: {
            isActive: true,
            label: 'Impressions'
          },
          dailyClicks: {
            isActive: false,
            label: 'Clicks'
          },
          dailyCpm: {
            isActive: false,
            label: 'CPM'
          },
          dailyCtr: {
            isActive: false,
            label: 'CTR'
          }
        };
        angular.extend(this.metrics, adMetrics);
      }

      /* calculate daily CPM */
      //var dailyCpm = {},
      //    dailyImpressions = $scope.channel_statistic.dailyImpressions,
      //    dailySpend = $scope.channel_statistic.dailySpend;
      //
      //dailyCpm = angular.copy(dailySpend);
      //angular.forEach(dailyCpm.info, function(value, key){
      //  if (dailySpend.info[key] && dailyImpressions.info[key]) {
      //    this[key] = (dailySpend.info[key]/dailyImpressions.info[key])*1000;
      //  } else {
      //    this[key] = 0;
      //  }
      //}, dailyCpm.info);
      //if (dailySpend.total && dailyImpressions.total) {
      //  dailyCpm.total = (dailySpend.total/dailyImpressions.total)*1000;
      //} else {
      //  dailyCpm.total = 0;
      //}
      //$scope.channel_statistic.dailyCpm = dailyCpm;

    });
