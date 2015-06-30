/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';

angular.module('ChannelBundle', [
  'AppBundle',
  'angularMoment',
  'ngClipboard',
  'EntityBundle',
  'OfferBundle',
  'df.formBundle',
  'angularFileUpload'
])
  .config(function ($stateProvider) {
    $stateProvider
      .state('ppp.offer.list.item.channels', {
        url: '/channels',
        resolve: {
          shared: function () {
            return {};
          }
        },
        onEnter: function (ppDialog, offer, $state, shared) {
          shared.dialog = ppDialog.open({
            controller: 'ChannelListController',
            template: 'app/bundle/channelBundle/template/distribution-channel-link.tpl.html',
            className: 'middle',
            data: {offer: offer}
          });
          shared.dialog.closePromise.then(function (args) {
            if (args.value !== 'onexit') {
              $state.go('ppp.offer.list');
            }
          });
        },
        onExit: function (shared) {
          if (shared.dialog) {
            return shared.dialog.close('onexit');
          }
        }
      })

      .state('channel', {
        parent: 'ppp.offer.list.item',
        //abstract: true,
        url: '/channel/:channel_type/:distributionChannel',
        resolve: {
          shared: function () {
            return {};
          },
          totalSpend: function(ppEntityManager, offers){
            var offerRepository = ppEntityManager.$getRepository('OfferRepository');
            return offerRepository.getTotalSpend(offers);
          },
          channelProvider: function (channels, $stateParams) {
            return channels.getProvider($stateParams.channel_type);
          },
          channel: function ($q, offer, channelProvider, channels, $stateParams) {
            var criteria = {
              type: channelProvider.getName().toUpperCase()
            };
            if ($stateParams.distributionChannel){
              criteria.distributionChannel = $stateParams.distributionChannel;
            }
            var channel = _.find(offer.channels, criteria);
            if (channel) {
              return channels.find(channel.id);
            } else {
              var e = channelProvider.getEntity();
              if ($stateParams.distributionChannel) {
                e.distributionChannel = $stateParams.distributionChannel;
              }
              return $q.resolve(e);
            }
          }
        },
        onEnter: function ($q, $controller, offer, ppDialog, $state, $stateParams, shared, notify, channelProvider, channel, totalSpend) {
          if (!offer.$getId()) {
            notify.error('Unable to find offer');
            $state.go('ppp.offer.list');
            return;
          }
          var controllerName = channelProvider.getConfig().controllerName;
          var template = channelProvider.getConfig().templateUrl;
          var dialogSettings = angular.extend({},{
            template: template || 'app/bundle/channelBundle/template/' + channel.getName() + '/index.tpl.html',
            controller: controllerName,
            className: 'popup-channel ' + channelProvider.getName(),
            data: {offer: offer, channel: channel, channelProvider: channelProvider, totalSpend: totalSpend},
            preCloseCallback: function (result) {
              var value = result;
              var cb = null;
              if (angular.isObject(result)){
                value = result.type;
                cb = result.callback;
              }
              if (angular.isArray(value)){
                shared.forwardTo = value[0];
                shared.forwardToArgs = value[1];
              } else if (value !== 'onexit' && dialogSettings.onClose) {
                return ppDialog.confirmClose(dialogSettings.onClose.confirm)
                  .then(function(){
                    if (cb){
                      cb();
                    }
                    return true;
                  });
              }
              if (cb){
                cb();
              }
            }
          }, channelProvider.getConfig().dialog || {});

          try {
            shared.dialog = ppDialog.open(dialogSettings);
            shared.dialog.closePromise.then(function () {
              var forwardTo = shared.forwardTo || 'ppp.offer.list';
              var forwardToArgs = shared.forwardToArgs;

              delete shared.forwardTo;
              delete shared.forwardToArgs;
              $state.go(forwardTo, forwardToArgs);
            });
          } catch (e) {
            $state.go('ppp.offer.list');
          }
          delete shared.dialog;
        },
        onExit: function (shared) {
          if (shared.dialog) {
            shared.dialog.close('onexit');
          }
        }
      })
      .state('ppp.offer.list.item.channelStatistic', {
        url: '/channel/statistic/:channel_type',
        resolve: {
          shared: function () {
            return {};
          }
        },
        onEnter: function ($q, ppDialog, $state, $stateParams, shared, notify, channels, offer) {
          var defer = $q.defer();

          function showDialog(statistic) {
            shared.dialog = ppDialog.open({
              template: 'app/bundle/channelBundle/template/statisticChannelWrap.tpl.html',
              //controller: 'ChannelStatisticController as vm',
              controller: 'OfferStatisticController as vm',
              className: 'popup-channel-statistic',
              data: {offer: offer, statistic: statistic}
            });
            shared.dialog.closePromise.then(function () {
              $state.go('ppp.offer.list');
            });
            defer.resolve();
          }

          offer.getChannelStatistic($stateParams.channel_type)
            .then(showDialog, showDialog);

          //.catch(function () {
          //  notify.error('Unable to find channel statistic');
          //  $state.go('ppp.offer.list');
          //  defer.reject();
          //});

          return defer.promise;
        },
        onExit: function (shared) {
          if (shared.dialog) {
            shared.dialog.close('onexit');
          }
        }
      });

  });
