/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */
'use strict';
angular.module('AppBundle')
  .service('ppApiTools',
  /**
   *
   * @param appTools
   * @param $ppHttp
   * @param {PPEntityManager}  ppEntityManager
   * @return {PPApiTools}
   * @param {moment} moment
   */
  function (appTools, ppEntityManager, moment, $http, $q) {

    /**
     * @class
     * @constructor
     */
    function PPApiTools() {
    }

    /**
     *
     * @type PPApiTools
     */
    PPApiTools.prototype = {
      getIABCategories: function () {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/iabCategories';
        opt.cacheIt = {
          tag: 'ppApiTools',
          key: 'iabCategories'
        };
        return ppEntityManager.$get(opt);
      },
      getTargetedCategories: function () {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/targetedCategories';
        opt.cacheIt = {
          tag: 'ppApiTools',
          key: 'targetedCategories'
        };
        return ppEntityManager.$get(opt);
      },
      getMetroCodes: function () {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/metroCodes';
        opt.cacheIt = {
          tag: 'ppApiTools',
          key: 'metroCodes'
        };
        return ppEntityManager.$get(opt);
      },
      getStates: function () {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/states';
        opt.cacheIt = {
          tag: 'ppApiTools',
          key: 'states'
        };
        return ppEntityManager.$get(opt).then(function (response) {
          var data = [];
          angular.forEach(response, function (item) {
            data.push({
              label: item.name,
              value: item.code
            });
          });

          return data;
        });
      },
      getCities: function(query) {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/cities?query=' + query;

        return ppEntityManager.$get(opt).then(function (response) {
            var data = [];
            angular.forEach(response, function (item) {
              data.push({
                label: item.name,
                value: item.id
              });
            });

            return data;
          });
      },

      getCity: function(id) {
        var opt = appTools.getPPHttpConfig();
        opt.url = '/campaign/city/'+id;

        return ppEntityManager.$get(opt).then(function (response) {
          return response;
        });
      },

      findCityBy: function(state, city){
        state = state || '';
        city = city || '';
        return ppEntityManager.$get({
          url: '/campaign/coordinates/city?state='+state+'&city='+city
        })
          .then(function(response){
            //var result = [];
            //angular.forEach(response, function(cityInfo){
            //  result.push({
            //    id: cityInfo.id,
            //    name: cityInfo.city,
            //    properties: cityInfo.properties,
            //    lat: cityInfo.lat,
            //    lng: cityInfo.lng,
            //    state: cityInfo.state,
            //    geometry: {
            //      type: cityInfo.type,
            //      coordinates: cityInfo.coordinates
            //    }
            //  });
            //});

            if (response.length === 0){
              return $q.reject([]);
            }

            return response;
          });
      },

      saveLocation: function(location) {
        var options = {
          url: '/location',
          data: location
        };
        return ppEntityManager.$put(options).then(function(data){
          return data;
        });
      },

      addLocation: function(location) {
        var options = {
          url: '/location',
          data: location
        };
        return ppEntityManager.$post(options).then(function(data){
          return data;
        });
      },

      getHeatmapData: function (min, max, filters) {
        var criteria = {};
        filters = filters || {};
        if (filters.date){
          if (angular.isArray(filters.date)) {
            criteria.days = filters.date;
          } else {
            criteria.days = filters.date.value;
          }
          //var range = moment.range(moment(filters.dates.start), moment(filters.dates.end));
          //range.by('days', function(day) {
          //  criteria.days.push(day.format('YYYYMMDD'));
          //});
        }
        if (filters.ranges && filters.ranges.length > 0) {
          criteria.ranges = filters.ranges;
        }
        if (filters.categories && filters.categories.length > 0) {
          criteria.categories = filters.categories;
        }
        var options = {
          url: '/analytics/salesAnalytics',
          data: angular.extend({
            maxLatitude: max.lat - (min.lat - max.lat),
            maxLongitude: max.lng - (min.lng - max.lng),
            minLatitude: min.lat + (min.lat - max.lat),
            minLongitude: min.lng + (min.lng - max.lng)
            //minLatitude: 38.8608,//max.lat,// - ((min.lat - max.lat) / 2),
            //maxLongitude: -77.0048,//max.lng,// - ((min.lng - max.lng) / 2),
            //maxLatitude: 38.8864,//min.lat,// + ((min.lat - max.lat) / 2),
            //minLongitude: -77.0304//min.lng// + ((min.lng - max.lng) / 2)
          }, criteria)
        };
        //console.log(options.data);
        return ppEntityManager.$post(options)
          .then(function(data){
            return data;
          });
      }
    };

    return new PPApiTools();
  })
;
