/**
 * Created by Nikita Lavrenko on 05.02.2015.
 */
'use strict';
angular.module('OfferBundle')
  .directive('offerChartsRound', function () {
    return {
      restrict: 'A',
      scope: {
        offer_statistic: '=offerChartsRound',
        label: '@',
        width: '=chartWidth'
      },
      template: '<div class="graph" google-chart chart="chartObject"></div>',
      controller: function ($scope) {
        function getItem() {
          var obj = {
            "type": "PieChart",
            "displayed": true,
            "options": {
              "title": $scope.label + "s",
              "width": $scope.width,
              "height": 300,
              "alignment": "center",
              "titleTextStyle": {
                "fontSize": 12,
                "fontName": "Lato",
                "alignment": "center"
              },
              "pieSliceText": 'label',
              "legend": {
                "position": "bottom",
                "textStyle": {
                  "fontSize": 12
                }
              }
            },
            "formatters": {}
          };

          /* dynamic settings */
          var setups = {};

          /* insert data in cols */
          setups.cols = [
            {
              "id": $scope.label.toLowerCase(),
              "label": $scope.label,
              "type": "string",
              "p": {}
            },
            {
              "id": "views",
              "label": "Views",
              "type": "number",
              "p": {}
            }
          ];


          /* insert data in rows */
          setups.rows = [];
          var statistic;
          var noData = {
            "No data": 0.1
          };

         if( _.isEmpty($scope.offer_statistic)){
           statistic = noData;
         }
          else{
           statistic = $scope.offer_statistic;
         }

          angular.forEach(statistic, function(value, key) {
            setups.rows.push({"c": [{"v" : key}, {"v": value}]});
          });

          obj.data = setups;
          return obj;
        }

        $scope.chartObject = getItem();
      }
    };
  });
