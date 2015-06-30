/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('ChannelBundle')
  .service('channels',
  /**
   *
   * @param $q
   * @param appConfig
   * @param $injector
   * @param {PPEntityManager} ppEntityManager
   * @param {UserService} userService
   * @param {DataTransformer} dataTransformer
   */
  function ($q, appConfig, $injector, ppEntityManager, userService, dataTransformer, ppApiTools) {
    /**
     * @class
     * @description
     * This is container of all registered Channels and also provide all common logic to work with channels.
     * If you want ot register new channel provider your should create an service with name example.channel and
     * extend it from BaseChannel. Also you should add some configuration into the `appConfig.channelBundle.channels`
     * config namespace
     * @constructor
     */
    function Channels() {
    }

    /**
     *
     * @type {Channels}
     */
    Channels.prototype = {
      /**
       *
       * @param name
       * @return {BaseChannel}
       */
      STATUS: {
        //INCOMPLETE: 'INCOMPLETE',
        //PENDING: 'PENDING',
        //RUNNING: 'RUNNING',

        ARCHIVE: 'ARCHIVE',
        APPROVED: 'APPROVE',
        PAUSED: 'PAUSE',
        RESUMED: 'RESUME',
        EXPIRED: 'EXPIRE',
        REJECTED: 'REJECTED'
      },

      EVENTS: {
        ONCHANGED: 'ChannelRepository:onChannelChanged',
        ONSTATUSCHANGED: 'ChannelRepository:onChannelStatusChanged'
      },

      getProvider: function (name) {
        return $injector.get(name.toLowerCase() + '.channel');
      },
      getAvailableProviders: function () {
        var names = Object.keys(appConfig.channelBundle.channels);
        var channelsList = {};
        var self = this;

        names = _.without(names, 'common');

        angular.forEach(names, function (n) {
          var c = self.getProvider(n);
          if (c) {
            channelsList[n] = c;
          }
        });

        return channelsList;
      },
      isProviderAvailable: function (name) {
        return !!this.getAvailableProviders()[name];
      },

      find: function find(id, options) {
        options = options || {
          //responseTransformer: 'displayChannel'
        };
        var self = this;
        options.url = '/campaign/' + id;
        return ppEntityManager.$get(options)
          .then(function (channel) {
            var provider = self.getProvider(channel.type);
            if (!provider) {
              throw 'Unsupported Channel ' + channel.type;
            }
            var transName = provider.getTransformerName ? provider.getTransformerName() : provider.getName() + 'Channel';
            if (dataTransformer.$has(transName)) {
              channel = dataTransformer.$transform(transName, channel);
            }
            return $q.resolve(provider.getEntity(channel));
          });
      },

      preSave: function preSave(channel) {
        //if (!channel.sendGeo) {
        //  return channel;
        //}
        //var params = appConfig.channelBundle.channels.display.transformFields[channel.geoActive];
        //if (params !== undefined) {
        //  channel[params.arrayName] = [];
        //  angular.forEach(channel[params.fieldName], function (item) {
        //    channel[params.arrayName].push(item[params.valueField]);
        //  });
        //}
        return channel;
      },

      saveGeo: function(type, channel){
        channel.merchantId = userService.getUser().id;
        var options = {
          url: '/campaign',
          data: {
            id: channel.id,
            type: channel.type
          }
        };

        switch (type.toUpperCase()){
          case 'NATIONAL' : {
            options.data.cityIds = [];
            options.data.stateCodes = [];
            options.data.locationIds = [];
            options.data.reachRadius = 0;
            return ppEntityManager.$put(options);
          }
          case 'STATE' :
          {
            options.data.cityIds = [];
            options.data.stateCodes = [channel.location.state];
            options.data.locationIds = [];
            options.data.reachRadius = 0;
            return ppEntityManager.$put(options);
          }
          case 'CITY' : {
            options.data.cityIds = [];
            options.data.stateCodes = [channel.location.state];
            options.data.locationIds = [];
            options.data.reachRadius = 0;
            return ppApiTools.findCityBy(channel.location.state, channel.location.city)
              .then(function(cities){
                if (cities[0] && cities[0].pmId){
                  options.data.cityIds = [cities[0].pmId];
                  return ppEntityManager.$put(options);
                } else {
                  return $q.reject({message: 'City Targeting Not Supported for "'+channel.location.city+'"'});
                }
              });
          }
          case 'GEO' : {
            options.data.cityIds = [];
            options.data.stateCodes = [];
            options.data.locationIds = [channel.location.id];
            options.data.reachRadius = {'0.5': 1, 2:3, 4:6, 6:9}[channel.reachRadius];
            return ppEntityManager.$put(options);
          }
        }
      },

      save: function save(channel, options) {
        //channel = this.preSave(channel);
        var defer = $q.defer();
        //var self = this;
        var method = channel.id ? '$put' : '$post';
        options = options || {
          //responseTransformer: 'offerDetails',
          //requestTransformer: 'displayChannel'
        };
        options.url = '/campaign';

        channel.merchantId = userService.getUser().id;

        var provider = this.getProvider(channel.getType());
        var transName = provider.getTransformerName ? provider.getTransformerName() : provider.getName() + 'Channel';
        if (dataTransformer.$has(transName)) {
          options.requestTransformer = transName;
        }
        options.data = channel;
        ppEntityManager[method](options)
          .then(function (response) {
            channel.id = response.id;
            channel.status = response.status;
            defer.resolve(channel);
          })
          .catch(function (e) {
            defer.reject(e);
          });

        return defer.promise;
      },

      /**
       * Link the channel to offer
       * @param {(ChannelEntity | string)} channel
       * @param {(OfferEntity | string)} offer
       * @returns {promise}
       */
      linkToOffer: function (channel, offer) {
        var offerId = offer.id || offer;
        var channelId = channel.id || channel;
        var offerRepository = ppEntityManager.$getRepository('OfferRepository');

        return ppEntityManager.$post({
          url: '/campaign/link_offer',
          responseTransformer: 'offerDetails',
          data: {
            campaignId: channelId,
            offerId: offerId
          }
        })
          .then(function(result){
            return offerRepository.$find(offer.id)
              .then(function(offer){
                offerRepository.trigger(offerRepository.EVENTS.ONCHANGED, [offer]);
                return result;
              });
          });
      },

      /**
       * Link the channel to ad
       * @param {(ChannelEntity | string)} channel
       * @param {(OfferEntity | string)} ad
       * @returns {promise}
       */
      linkToAd: function (channel, ad) {
        var adId = ad.id || ad;
        var channelId = channel.id || channel;

        return ppEntityManager.$post({
          url: '/campaign/link_ad',
          data: {
            campaignId: channelId,
            adId: adId
          }
        });
      },

      unlinkAd: function(channel, ad){
        var adId = ad.id || ad;
        var channelId = channel.id || channel;

        return ppEntityManager.$post({
          url: '/campaign/unlink_ad',
          data: {
            campaignId: channelId,
            adId: adId
          }
        });
      },

      changeStatus: function (channel, status) {
        var self = this;
        var id = channel.id;
        /**
         *
         * @type {OfferRepository}
         */
        var offerRepository = ppEntityManager.$getRepository('OfferRepository');
        status = status.toLowerCase();

        return ppEntityManager.$get({
          url: '/campaign/' + status + '/' + id,
          responseTransformer: 'offerDetails'
        })
          .then(function(result){
            var linkedOffer = result.linkedOffer || channel.linkedOffer;
            return offerRepository.$find(linkedOffer.id)
              .then(function(offer){
                channel.status = result.status;
                channel.linkedOffer = offer;
                offerRepository.trigger(offerRepository.EVENTS.ONCHANGED, [offer]);
                ppEntityManager.trigger(self.EVENTS.ONCHANGED, [channel]);
                ppEntityManager.trigger(self.EVENTS.ONSTATUSCHANGED, [channel]);
                return $q.resolve(channel);
              });
          });
      },

      /**
       *
       * @param {ChannelEntity | string} channel
       * @returns {promise}
       */
      getChannelStatistic: function (channel) {
        var channelId = angular.isObject(channel) ? channel.id : channel;
        var requests = [];
        requests.push(ppEntityManager.$get({
          responseTransformer: 'channelStatistic',
          url: '/analytics/campaign/' + channelId
        }));

        if (channel.ads && channel.ads.length > 0) {
          requests.push(ppEntityManager.$get({
            responseTransformer: 'adStatistic',
            url: '/analytics/ad/' + channel.ads[0].id
          }));
        }
        return $q.all(requests)
          .then(function (data) {
            return $q.resolve({channel: data[0], ad: data[1]});
          });
      }
    };

    return new Channels();
  });
