/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('ChannelBundle')
  .factory('DisplayEntity', [
    'ChannelEntity', 'moment', 'validator', 'appConfig', function (BaseEntity, moment, validator, appConfig) {
      function DisplayEntity() {
        BaseEntity.prototype.$construct.apply(this, arguments);
        if (this.devices.length === 0) {
          this.devices = [];
          this.devices.push('');
        }
      }


      DisplayEntity.prototype = {
        $getDefaults: function () {
          return appConfig.channelBundle.channels.display.entity.defaults;
        },
        updateBudgetsSettings: function () {
          var start = new Date(this.startDate);
          var end = new Date(this.endDate);
          var dr = moment.range(start, end);
          var hours = dr.diff('hours');
          this.hourlyBudget = this.totalBudget / hours;

          switch (this.budgetType) {
            case 'PERDAY':
            {
              this.maxBid = (this.totalBudget / hours) * 24;
              break;
            }
            case 'PERWEEK':
            {
              this.maxBid = (this.totalBudget / hours) * 24 * 7;
              break;
            }
            default :
            {
              this.maxBid = this.totalBudget / hours;
              break;
            }
          }
        }
        /*,
         setGeoTargeting: function(data) {
         data.metroCodes = [];
         data.states = [];
         data.cities = [];
         },
         setCityTargeting: function(data) {
         data.locationIds = [];
         data.metroCodes = [];
         data.states = [];
         },
         setStateTargeting: function(data) {
         data.locationIds = [];
         data.metroCodes = [];
         data.cities = [];
         },
         setMetroTargeting: function(data) {
         data.locationIds = [];
         data.states = [];
         data.cities = [];
         }*/

      };

      BaseEntity.extend(DisplayEntity);

      return DisplayEntity;
    }
  ]);
