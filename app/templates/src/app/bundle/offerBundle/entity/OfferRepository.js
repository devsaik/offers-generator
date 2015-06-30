/**
 * Created by Nikita Yaroshevich for p3-app.
 */


'use strict';
angular.module('OfferBundle')
  .factory('OfferRepository',
  /**
   *
   * @param {PPRepository} PPRepository
   * @param appConfig
   * @param {AppTools} appTools
   * @param {OfferEntity} OfferEntity
   * @param $q
   * @param {UserService} userService
   * @param moment
   * @param {Channels} channels
   * @return {OfferRepository}
   */
    function (PPRepository, appConfig, appTools, OfferEntity, $q, userService, moment, channels) {
      var defaultData = null;

      /**
       * @ngdoc type
       * @class
       * @extends PPRepository
       * @description
       * This is Ad PPRepository
       * @constructor
       *
       */
      function OfferRepository() {
        this.$$entityName = 'offer';
        this.$$entityType = OfferEntity;
      }

      /**
       * @type OfferRepository
       */
      OfferRepository.prototype = {
        STATUS: {
          INCOMPLETE: 'INCOMPLETE',
          APPROVED: 'APPROVE',
          PENDING: 'PENDING',
          RUNNING: 'RUNNING',
          REJECTED: 'REJECTED',
          PAUSED: 'PAUSE',
          EXPIRED: 'EXPIRE',
          ARCHIVE: 'ARCHIVE'
        },

        DISCOUNTTYPES: {
          ABSOLUTE: 'ABSOLUTE',
          PERCENTAGE: 'PERCENTAGE',
          BUYGET: 'BUYGET',
          FREE: 'FREE'
        },

        EVENTS: {
          ONCHANGED: 'OfferRepository:onOfferChanged',
          ONCREATED: 'OfferRepository:onOfferCreated'
        },

        $$parseResponse: function (data) {
          if (data.offers) {
            return data.offers;
          }
          if (data.offer) {
            return data.offer;
          }
          return data;
        },

        $save: function (entity, options) {
          var isNew = entity.id === null || entity.id === undefined;
          options = options || {};
          options = angular.extend(options, {
            responseTransformer: 'offerDetails, offerRejectedTransformer',
            requestTransformer: 'offerRejectedTransformer, offerDetails'});
          var self  = this;
          options.url = options.url || '/' + this.$$entityName;
          //options.cacheIt = {
          //  tag: this.$$entityName,
          //  key: entity.id,
          //  invalidate: true,
          //  cacheDelegate: function (result) {
          //    return angular.extend(result, entity);
          //  }
          //};
          return PPRepository.prototype.$save.call(this, entity, options)
            .then(function (result) {
              result = angular.extend(result, entity);
              if (!options.silent){
                if (isNew) {
                  self.trigger(self.EVENTS.ONCREATED, [result]);
                } else {
                  self.trigger(self.EVENTS.ONCHANGED, [result]);
                }
              }
              return result;
            });
        },

        $saveAndApprove: function(entity, options){
          options = options || {};
          options.silent = true;
          var self = this;
          return this.$save(entity, options)
            .then(function(entity){
              return self.changeStatus(entity, self.STATUS.APPROVED);
            });
        },

        $find: function (id, options) {
          options = options || {
            responseTransformer: 'offerDetails, offerRejectedTransformer'
          };
          //options.cacheIt = {
          //  tag: this.$$entityName,
          //  key: id
          //};
          return PPRepository.prototype.$find.call(this, id, options);
        },
        $findOneBy: function (criteria, options) {
          options = options || {
            responseTransformer: 'offerDetails, offerRejectedTransformer'
          };
          return PPRepository.prototype.$findOneBy.call(this, criteria, options);
        },
        $findBy: function (criteria, options) {
          var self = this;

          options = options || {
            url: '/analytics/' + criteria.merchantId + '/offers',
            responseTransformer: 'offerList, offerRejectedTransformer'
          };
          return this.$getEM().$get(options)
            .then(function(objects){
              var offers = [];
              angular.forEach(objects, function(data){
                offers.push(self.$create(data));
              });
              return offers;
            });
        },
        changeStatus: function (offer, status, del) {
          var self  = this;
          //var id = offer.$getId ? offer.$getId() : offer;
          var id = offer.$getId ? offer.$getId() : offer.id;
          status = status.toLowerCase();

          if (del) {
            if (
              status === 'running' ||
              status === 'paused' ||
              status === 'pending' ||
              status === 'rejected'
            ) {
              status = self.STATUS.EXPIRED.toLowerCase();
            } else {
              status = self.STATUS.ARCHIVE.toLowerCase();
            }
          } else if (status === 'running') {
            status = 'resume';
          }

          return this.$getEM().$get({url: '/offer/' + status + '/' + id})
            .then(function (result) {
              if (result.offer.status === 'EXPIRED') {
                status = self.STATUS.ARCHIVE.toLowerCase();
                return self.$getEM().$get({url: '/offer/' + status + '/' + id})
                  .then(function(res){
                    offer.status = res.offer.status;
                    offer.shortUrl = res.offer.shortUrl;

                    self.trigger(self.EVENTS.ONCHANGED, [offer]);
                    return $q.resolve(offer);
                  });
              } else {
                offer.status = result.offer.status;
                offer.shortUrl = result.offer.shortUrl;

                self.trigger(self.EVENTS.ONCHANGED, [offer]);
                return $q.resolve(offer);
              }
            });
        },

        /**
         *
         * @param {OfferEntity | string} offer
         * @return {*}
         */
        getOfferStatistics: function (offer) {
          var id = offer.id || offer;
          var url = '/analytics/offer/' + id;
          return this.$getEM().$get({
            responseTransformer: 'offerStatistic',
            url: url
          })
            .then(function (stats) {
              stats.params = {};

              function extend(obj, item, info) {

                function sum(obj) {
                  return Object.keys(obj)
                    .reduce(function (sum, key) {
                      return sum + parseFloat(obj[key]);
                    }, 0);
                }

                obj[item] = {};
                obj[item].info = info;
                obj[item].total = sum(obj[item].info);

                return obj;
              }

              extend(stats.params, 'accepts', stats.dailyAccepts);
              extend(stats.params, 'redemptions', stats.dailyRedemptions);
              extend(stats.params, 'revenue', stats.dailyRevenue);
              extend(stats.params, 'shares', stats.dailyShares);
              extend(stats.params, 'viewDuration', stats.dailyViewDuration);
              extend(stats.params, 'views', stats.dailyViews);

              /* delete repeat data */
              delete stats.dailyAccepts;
              delete stats.dailyRedemptions;
              delete stats.dailyRevenue;
              delete stats.dailyShares;
              delete stats.dailyViewDuration;
              delete stats.dailyViews;

              if (offer.channels && offer.channels.length > 0){
                var ch = _.find(offer.channels, {type: 'DISPLAY'});
                if (ch){
                  return channels.getChannelStatistic(ch)
                    .then(function(channelsStats){
                      var allChannelStats = angular.extend({}, channelsStats.channel, channelsStats.ad);
                      stats.params = angular.extend({} ,stats.params, allChannelStats);
                      return stats;
                    })
                    .catch(function(){
                      return stats;
                    });
                }
              }

              return $q.resolve(stats);
            });
        },


        getCurrentMerchantId: function () {
          return userService.getUser().id;
        },

        getCurrentMerchantOffersList: function(){
          return this.$findBy({merchantId: this.getCurrentMerchantId()});
        },

        duplicate: function (id) {
          var options = {
            responseTransformer: 'offerDetails, offerRejectedTransformer',
            url: '/offer/duplicate/' + id + '/merchant/' + this.getCurrentMerchantId()
          };
          return this.$getEM().$post(options);
        },

        /**
         * @deprecated
         * @param offer
         * @return {boolean}
         */
        isActive: function () {
          throw 'Deprecated. User OfferEntity instead';
        },

        loadDefaultTo: function (obj) {
          var defer = $q.defer();
          var self = this;

          if (obj.id) {
            return $q.resolve(obj);
          }

          if (defaultData) {
            defer.resolve(angular.copy(angular.extend(obj, defaultData)));
          } else {
            userService.getToken().getUser().getProfile()
              .then(function (profile) {
                defaultData = appConfig.ENTITY[self.$$entityName].defaults;
                defaultData.imageUrl = profile.branding.imageUrl;
                defaultData.companyName = profile.branding.merchantName;
                //2014-11-13 //add(7, 'days')
                defaultData.merchantId = userService.getToken().getUser().id;
                defaultData.startTime = moment().format('YYYY/MM/DD');
                defaultData.endTime = moment().add(13, 'days').format('YYYY/MM/DD');
                defer.resolve(angular.copy(angular.extend(obj, defaultData)));
              });
          }
          return defer.promise;
        },


        //Channels methods

        addChannel: function (channel, offer, options) {
          var defer = $q.defer();
          var self = this;
          options = options || {
            //responseTransformer: 'offerDetails',
            requestTransformer: 'offerRejectedTransformer, offerDetails'
          };
          options.url = '/campaign';

          options.data = channel;
          this.$getEM().$post(options)
            .then(function(response){
              self.$getEM().$post({
                url: '/campaign/link_offer',
                responseTransformer: 'offerDetails, offerRejectedTransformer',
                data: {
                  'campaignId' : response.data.id,
                  'offerId' : offer.$getId()
                }
              })
                .then(function(r){
                  defer.resolve(r);
                })
                .catch(function(e){
                  defer.reject(angular.extend({type: 'not_linked'}, e));
                });
            })
            .catch(function(e){
              defer.reject(e);
            });

          return defer.promise();
        },

        getTotalSpend: function(offers){
          var defer = $q.defer();

          function doCalculate(offers){
            var result = 0;
            angular.forEach(offers, function(offer){
              result += offer.getTotalSpend();
            });
            return result;
          }

          if (!offers){
            this.getCurrentMerchantOffersList()
              .then(function(offers){
                defer.resolve(doCalculate(offers));
              })
              .catch(function(){
                defer.resolve(doCalculate([]));
              });
          } else {
            defer.resolve(doCalculate(offers));
          }


          return defer.promise;
        },

        getOfferPreviewImages: function (offer, params) {
          var id = offer.id || offer;
          params = params || {};
          params = angular.extend(params, {
            mobile: {width: 320, height: 768},
            tablet: {width: 1024, height: 768}
          });
          params.promotionExtId = id;
          var options = {
            url: '/offer/url2png',
            data: params
          };
          return this.$getEM().$post(options);
          //
          //var d = $q.defer();
          //
          //d.resolve({
          //  updatedAt: 'Tue May 19 10:49:52 UTC 2015',
          //  mobile: 'http://s3.amazonaws.com/url2png/30/P52DDCD457DC2A/55f63f0aab5553eb6380582e0d834649ad453eae.png',
          //  tablet: 'http://s3.amazonaws.com/url2png/30/P52DDCD457DC2A/7c79519cfe081e7bc47ba7a99c7987d924d0022d.png'
          //});
          //return d.promise;
        }

      };
      PPRepository.extend(OfferRepository);


      return OfferRepository;
    }
);
