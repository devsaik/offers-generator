/**
 * Created by Artyom on 12/8/2014.
 */
'use strict';


angular.module('OfferBundle')
  .directive('offerStatsChoice', function () {
    return {
      restrict: 'A',
      scope: {
        offer: '=offerStatsChoice'
      },
      templateUrl: 'app/bundle/offerBundle/template/directive/offer-stats-choice.tpl.html',
      link: function (scope, element, attrs) {
        scope.controls = {defaultMetric: attrs.defaultMetric || 'redemptions'};
        scope.isOpen = false;
        scope.trigger = function () {
          scope.isOpen = !scope.isOpen;
        };
      },
      controller: function ($scope) {
        /* in comments parameters not delete */
        if ($scope.offer.channels && $scope.offer.channels.length === 0 ){
          $scope.maps = {
            views: 'Views',
            //accepts: 'Accepts',
            redemptions: 'Redemptions',
            totalSales: 'Sales'
            //revenue: 'Revenue',
            //shares: 'Shares',
            //spend: 'Spend',
            //views: 'Views'
            //clicks: 'Clicks',
            //displays: 'Displays',
            //totalSales: 'Total sales',
            //uniquePageViews: 'Unique page views',
            //viewDuration: 'View Duration',
            //impressions: 'Impressions'
          };
        } else {
          $scope.maps = {
            views: 'Views',
            clicks: 'Clicks',
            redemptions: 'Redemptions',
            totalSales: 'Sales',
            spend: 'Spend',
            //accepts: 'Accepts',
            revenue: 'ROI'
            //shares: 'Shares',
            //spend: 'Spend',
            //displays: 'Displays',
            //uniquePageViews: 'Unique page views',
            //viewDuration: 'View Duration',
            //impressions: 'Impressions'
          };
        }


        $scope.spend = 0;

        for (var i = 0; $scope.offer.channels && i < $scope.offer.channels.length; i++) {
          if (!$scope.offer.channels[i].hasOwnProperty('spend')) {
            return;
          }
          $scope.spend += $scope.offer.channels[i].spend;
        }
      }
    };
  });
