/**
 * Created by nikita on 1/13/15.
 */


'use strict';
/**
 * https://github.com/tombatossals/angular-leaflet-directive
 */
angular.module('AppBundle')
  .directive('heatmap',
  /**
   *
   * @param appConfig
   * @param {PPApiTools} ppApiTools
   * @param {DataTransformer} dataTransformer
   * @param $window
   * @param $http
   * @param {AppTools} appTools
   * @param notify
   * @param $q
   */
  function (appConfig, ppApiTools, dataTransformer, $window, $http, appTools, notify, $q, $interval, $timeout) {

    return {
      restrict: 'E',
      //replace: true,
      templateUrl: 'app/bundle/channelBundle/template/directive/heatmap.tpl.html',
      scope: {
        channel: '=',
        estimatedCustomers: '=?',
        showCustomersPopup: '@?',
        filter: '=?'
      },
      link: function (scope, element, attrs) {
        scope.mapHeight = attrs.mapHeight;

      },
      controllerAs: 'vm',
      controller: function ($scope, leafletData) {
        var vm = this;
        var L = $window.L;
        var distanceCof = 1000 * 1.60934;


        $scope.controls = {
          debug: {},
          ranges: appConfig.channelBundle.channels.display.heatmap.filters.ranges,
          heatmapLoading: false,
          markers: [],
          center: {
            autoDiscover: false,
            zoom: appConfig.channelBundle.channels.display.heatmap.defaults.zoom[$scope.channel.geoActive]
          },
          layers: {
            baselayers: {
              osm: {
                name: 'Map',
                url: appConfig.CONSTANTS.MAP.tiles.url,
                type: 'xyz'
              }
            },
            overlays: {
              heatmap: {
                name: 'Heat Map',
                type: 'webGLHeatmap',
                data: [],
                visible: true,
                layerOptions: {
                  opacity: 0.5,
                  size: 5000
                }
              }
            }
          },
          controls: {
            draw: {}
          },
          mapDefaults: {
            detectRetina: true,
            reuseTiles: true,
            //minZoom: 11,
            zoomControlPosition: 'topright'
          },
          events: {
            map: {
              enable: ['zoomstart', 'moveend'],
              logic: 'emit'
            }
          },
          geojson: {}
        };
        //------------------------------------------------------
        $scope.tiles = appConfig.CONSTANTS.MAP.tiles;
        $scope.controls.bounds = {};

        var defaultCenter = appConfig.channelBundle.channels.display.heatmap.defaults.mapCenter[$scope.channel.geoActive];
        if (defaultCenter !== undefined) {
          $scope.controls.center.lat = defaultCenter.lat;
          $scope.controls.center.lng = defaultCenter.lng;
        }

        //this.applyFilters = function () {
        //  $scope.filters = {
        //    range: $scope.controls.range,
        //    dates: {start: $scope.controls.filterStart, end: $scope.controls.filterEnd}
        //  };
        //  leafletData.getMap().then(function (map) {
        //    vm.refreshHeatmap(map);
        //  });
        //};
        //
        //this.cleanupFilters = function () {
        //  delete $scope.filters;
        //  leafletData.getMap().then(function (map) {
        //    vm.refreshHeatmap(map);
        //  });
        //};

        var radiusLayer = [];// = L.layerGroup();
        //leafletData.getMap()
        //  .then(function(map){
        //    radiusLayer.addTo(map);
        //  });


        this.drawCircle = function (map, lat, lng, radius) {
          var point = L.latLng(lat, lng);
          var circle = L.circle(point, radius);
          circle.addTo(map);
          radiusLayer.push(circle);
        };

        $scope.$watch('filter', _.debounce(function () {
          $scope.$apply(function () {
            $scope.estimatedCustomers = 0;
            if ($scope.channel.geoActive === 'GEO') {
              vm.updateCustomersCountByRadius();
              vm.updateHeatmap();
            } else if ($scope.currentBounds) {
              vm.updateCustomersCountByBound($scope.currentBounds.southWest, $scope.currentBounds.northEast);
            }
          });
        }, 500), true);

        this.updateCustomersCountByRadius = function () {
          var lat = $scope.channel.location.lat;
          var lng = $scope.channel.location.lng;
          //var radiusMin = $scope.filter.spendingMin * distanceCof;
          //var radiusMax = $scope.filter.spendingMax * distanceCof;
          var radius = $scope.channel.reachRadius * distanceCof;

          var d2r = Math.PI / 180; // degrees to radians
          var r2d = 180 / Math.PI; // radians to degrees
          var earthRadius = 6371.2 * distanceCof; // 6371 is the radius of the earth in km

          // find the radius in lat/lon
          var rlat = (radius / earthRadius) * r2d;
          var rlng = rlat / Math.cos(lat * d2r);

          var ex;
          var ey;
          ex = lng + (rlng * Math.cos(d2r * (180))); // center a + radius x * cos(theta)
          ey = lat + (rlat * Math.sin(d2r * (180))); // center b + radius y * sin(theta)
          var southWestMin = L.latLng(ey, ex);

          ex = lng + (rlng * Math.cos(d2r * 45)); // center a + radius x * cos(theta)
          ey = lat + (rlat * Math.sin(d2r * 45)); // center b + radius y * sin(theta)
          var northEastMin = L.latLng(ey, ex);

          //rlat = (radiusMax / earthRadius) * r2d;
          //rlng = rlat / Math.cos(lat * d2r);
          //
          //ex = lng + (rlng * Math.cos(d2r * (180))); // center a + radius x * cos(theta)
          //ey = lat + (rlat * Math.sin(d2r * (180))); // center b + radius y * sin(theta)
          //var southWestMax = L.latLng(ey, ex);
          //
          //ex = lng + (rlng * Math.cos(d2r * 45)); // center a + radius x * cos(theta)
          //ey = lat + (rlat * Math.sin(d2r * 45)); // center b + radius y * sin(theta)
          //var northEastMax = L.latLng(ey, ex);

          $scope.filter.ranges = vm.getRanges($scope.filter.transactionMin, $scope.filter.transactionMax);
          ppApiTools.getHeatmapData(southWestMin, northEastMin, $scope.filter).then(function (dataMin) {
            $scope.estimatedCustomers = 0;
            angular.forEach(dataMin.tiles, function(item){
              $scope.estimatedCustomers += item.transactionsCount;
            });
            //var minCustomers = _.reduce(dataMin.tiles, function (memo, item) {
            //  return memo + item.transactionsCount;
            //}, 0);
            //ppApiTools.getHeatmapData(southWestMax, northEastMax, $scope.filter).then(function (dataMax) {
            //  var maxCustomers = _.reduce(dataMax.tiles, function (memo, item) {
            //    return memo + item.transactionsCount;
            //  }, 0);

              //$scope.estimatedCustomers = maxCustomers - minCustomers;
            });
        };

        this.updateCustomersCountByBound = function (southWest, northEast) {
          $scope.filter.ranges = vm.getRanges($scope.filter.transactionMin, $scope.filter.transactionMax);
          ppApiTools.getHeatmapData(southWest, northEast, $scope.filter)
            .then(function (data) {
              vm.setHeatmapData(data);
              $scope.estimatedCustomers = _.reduce(data.tiles, function (memo, item) {
                return memo + item.transactionsCount;
              }, 0);
            });
        };

        this.updateHeatmap = function() {
          leafletData.getMap().then(function (map) {
            var bounds = map.getBounds();
            vm.updateHeatmapByBounds(bounds.getSouthWest(), bounds.getNorthEast());
          });
        };

        this.updateHeatmapByBounds = function (southWest, northEast) {
          $scope.filter.ranges = vm.getRanges($scope.filter.transactionMin, $scope.filter.transactionMax);
          ppApiTools.getHeatmapData(southWest, northEast, $scope.filter)
            .then(function (data) {
              vm.setHeatmapData(data);
              $scope.controls.heatmapLoading = false;
            });
        };

        this.getRanges = function (min, max) {
          if (min === undefined || max === undefined) {
            return [];
          }
          var result = [];
          max = angular.isString(max) ? 1100 : max;
          angular.forEach(appConfig.channelBundle.channels.display.heatmap.filters.ranges.options, function (range) {
            if (range.min >= min && range.max <= max) {
              result.push(range.label);
            }
          });
          return result;
        };

        this.updateCircles = function (radius) {
          leafletData.getMap().then(function (map) {
            radius = radius * distanceCof; //im miles

            angular.forEach(radiusLayer, function (circle) {
              map.removeLayer(circle);
            });
            radiusLayer = [];
            $scope.controls.markers = [];

            if ($scope.channel.geoActive !== 'GEO') {
              return;
            }
            if ($scope.channel.location) {
              $scope.controls.markers.push(dataTransformer.$transform('locationToMarker', $scope.channel.location));
              vm.drawCircle(map, $scope.channel.location.lat, $scope.channel.location.lng, radius);
              vm.updateCustomersCountByRadius();
            }
          });
        };

        this.setHeatmapData = function (data) {
          var result = [];
          if ($scope.controls.debug.labels) {
            $scope.controls.markers = [];
          }
          if (this.isHeatmapEndbled()){
            angular.forEach(data.tiles, function (d) {
              d.heat = (0.6 * Math.pow(d.heat, 3));
              //console.log(d.heat);
              result.push([d.latitude, d.longitude, d.heat]);
              if ($scope.controls.debug.labels) {

                $scope.controls.markers.push({
                  lat: d.latitude,
                  lng: d.longitude,
                  title: d.latitude + ', ' + d.longitude + ', ' + d.heat + ' (' + d.transactionsCount + ')',
                  label: {
                    message: (d.latitude + '').substring(0, 6) + '<br/>' + (d.longitude + '').substring(0, 6) + '<br/> ' + (d.heat + '').substring(0, 4) + ' <br/>(' + d.transactionsCount + ')',
                    options: {
                      noHide: true
                    }
                  }
                });
              }
            });
          }


          leafletData.getMap().then(function (map) {
            var heatLayer = {};
            map.eachLayer(function (layer) {
              if (layer.canvas !== undefined) {
                heatLayer = layer;
              }
            });
            heatLayer.options.size = data.areaWidth * 2500;
            heatLayer.setData(result.length === 0 ? [[0,0,0]] : result);
            heatLayer._show();
            heatLayer.update();

            vm.makeMapNotSoBaggie();
          });
        };

        $scope.$watch('channel.reachRadius', _.debounce(function (val) {
          $scope.$apply(function () {
            if ($scope.channel.geoActive === 'GEO') {
              vm.updateCircles(val);
            }
          });
        }, 500));

        $scope.$watch('channel.location', function (val) {
          if ($scope.channel.geoActive !== 'GEO') {
            return;
          }

          if (val) {
            $scope.controls.center.lat = val.lat;
            $scope.controls.center.lng = val.lng;
            $scope.controls.center.zoom = appConfig.channelBundle.channels.display.heatmap.defaults.zoom.GEO;
            vm.updateCircles($scope.channel.reachRadius);
          }
        });

        $scope.$watch('channel.location.city', function (val) {
          if ($scope.channel.geoActive !== 'City' || !val) {
            return;
          }
          ppApiTools.findCityBy($scope.channel.location.state, $scope.channel.location.city)
            .then(function (data) {
              vm.moveMapToObject(val, data);
            })
            .catch(function(){
              notify.error('Unable to find city "'+$scope.channel.location.city+'"');
            });
        });

        var statesInfo;
        $scope.$watch('channel.location.state', function (val) {
          if ($scope.channel.geoActive !== 'State' || !val) {
            return;
          }
          if (statesInfo === undefined) {
            $http.get(appTools.getPPApiBaseUrl() + '/portable/assets/states.json')
              .success(function (data) {
                statesInfo = data;
                vm.moveMapToObject(val, statesInfo);
              });
          } else {
            vm.moveMapToObject(val, statesInfo);
          }
        });

        this.moveMapToObject = function (objectLabel, objList) {
          var geoJson = {
            data: {
              type: 'FeatureCollection',
              features: []
            },
            style: {
              color: '#66B5D4',
              opacity: 0.8,
              weight: 3,
              fillColor: '#0ED8BA',
              fillOpacity: 0.2
            }
          };
          var isGeoJson = false;
          var center;
          var objInfo = _.find(objList, function(obj){
            return obj.code === objectLabel || obj.name === objectLabel;
          });
          if (objInfo){
            if (objInfo.geometry !== undefined) {
              isGeoJson = true;
              geoJson.data.features.push({
                type: 'Feature',
                id: 'Object-' + objInfo.name,
                properties: {
                  name: objInfo.name
                },
                geometry: objInfo.geometry
              });
            } else {
              center = L.latLng(objInfo.lat, objInfo.lng);
            }
          }

          $scope.controls.geojson = geoJson;

          $scope.controls.center = $scope.controls.center || {};
          if ( $scope.channel.location && (!$scope.controls.center.lat || !$scope.controls.center.lng) ){
            $scope.controls.center.lat = center ? center.lat : $scope.channel.location.lat;
            $scope.controls.center.lng = center ? center.lng : $scope.channel.location.lng;
          }
          leafletData.getMap().then(function (map) {


            if (isGeoJson) {
              var gj = L.geoJson();
              gj.addData(geoJson.data);
              var bounds = gj.getBounds();
              map.fitBounds(bounds);
              vm.updateCustomersCountByBound(bounds.getSouthWest(), bounds.getNorthEast());
              $scope.currentBounds = {
                southWest: bounds.getSouthWest(),
                northEast: bounds.getNorthEast()
              };
              $scope.controls.center.zoom = map.getZoom();
            } else if (center) {
              $scope.currentBounds = undefined;
              map.setView(center, appConfig.channelBundle.channels.display.heatmap.defaults.zoom[$scope.channel.geoActive]);
            }
          });
        };

        /**
         * FIXME I known this is hell, but unable to locate the core of evil
         */
        this.makeMapNotSoBaggie = function makeMapNotSoBaggie() {
          $timeout(function () {
            leafletData.getMap().then(function (map) {
              map._onResize();
              map.eachLayer(function (layer) {
                if (layer.canvas !== undefined) {
                  layer.update();
                }
              });
            }, 1000);
          });
        };
        //$interval(function () {
        //  leafletData.getMap().then(function (map) {
        //    map._onResize();
        //  }, 1000);
        //});
        /**
         * endoffixme
         */

        $scope.$watch('channel.geoActive', function (val) {
          vm.makeMapNotSoBaggie();

          if (val === undefined) {
            return;
          }
          if (val !== 'GEO') {
            leafletData.getMap().then(function () {
              var geoZoom = appConfig.channelBundle.channels.display.heatmap.defaults.zoom.GEO;
              $scope.controls.center.zoom = geoZoom < $scope.controls.center.zoom ? $scope.controls.center.zoom : geoZoom;
              //var heatLayer = {};
              //map.eachLayer(function (layer) {
              //  if (layer.canvas !== undefined) {
              //    heatLayer = layer;
              //  }
              //});
              //heatLayer.options.size = 0;
              //heatLayer._hide();
              //heatLayer.setData([]);
              //heatLayer.update();
            });
          }


          $scope.controls.markers = [];
          vm.updateCircles($scope.channel.reachRadius);
          if (setMap[val] !== undefined) {
            setMap[val]();
          }
        });

        this.isHeatmapEndbled = function(){
          return $scope.channel.geoActive === 'GEO';
        };

        this.setMapToCity = function () {
          if ($scope.channel.location.city) {
              ppApiTools.findCityBy($scope.channel.location.state, $scope.channel.location.city)
              //$http.get(appTools.getPPApiBaseUrl() + '/portable/assets/cities.json')
                .then(function (data) {
                  if (data.length > 1 || !data[0].pmId){
                    notify.error('City Targeting Not Supported for "'+$scope.channel.location.city+'"');
                  }
                  vm.moveMapToObject($scope.channel.location.city, data);
                })
                .catch(function(){
                  notify.error('Unable to find city "'+$scope.channel.location.city+'"');
                });
          }
        };

        this.setMapToState = function () {
          if ($scope.channel.location && $scope.channel.location.state) {
            if (statesInfo === undefined) {
              $http.get(appTools.getPPApiBaseUrl() + '/portable/assets/states.json')
                .success(function (data) {
                  statesInfo = data;
                  vm.moveMapToObject($scope.channel.location.state, statesInfo);
                });
            } else {
              vm.moveMapToObject($scope.channel.location.state, statesInfo);
            }
          }
        };

        var countryInfo;
        this.setMapToNational = function () {
          if (countryInfo === undefined) {
            $http.get(appTools.getPPApiBaseUrl() + '/portable/assets/country.json')
              .success(function (data) {
                countryInfo = data;
                vm.moveMapToObject('USA', countryInfo);
              });
          } else {
            vm.moveMapToObject('USA', countryInfo);
          }
        };

        this.setMapToHyperLocal = function () {
          if ($scope.channel.location) {
            $scope.controls.center.lat = $scope.channel.location.lat;
            $scope.controls.center.lng = $scope.channel.location.lng;
            $scope.controls.center.zoom = appConfig.channelBundle.channels.display.heatmap.defaults.zoom.GEO;
            vm.updateCustomersCountByRadius();
            vm.makeMapNotSoBaggie();
          }
        };

        var setMap = {
          City: vm.setMapToCity,
          State: vm.setMapToState,
          National: vm.setMapToNational,
          GEO: vm.setMapToHyperLocal
        };
        $scope.$on('leafletDirectiveMap.moveend', function () {
          if ($scope.channel.geoActive === 'GEO' && $scope.channel.location) {
            vm.updateHeatmap();
          }
        });
      }
    };
  });
