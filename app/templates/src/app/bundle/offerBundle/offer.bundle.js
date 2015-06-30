/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';
  angular.module('OfferBundle', [
    'AppBundle',
    'smart-table',
    'ngClipboard',
    'formFor',
    'ngDialog',
    'googlechart',
    'ChannelBundle'
  ])
    .config(function ($stateProvider, ngClipProvider, appToolsProvider, $sceProvider) {
      // @todo investigate and enable SCE. The issue is in ppMessage filter.
      $sceProvider.enabled(false);
      ngClipProvider.setPath(appToolsProvider.appRootUrl + 'assets/ZeroClipboard.swf');
      $stateProvider
        .state('ppp.offer', {
          abstract: true,
          url: '/offer',
          views: {
            rightside: {
              templateUrl: 'app/layout/partial/popular-items.tpl.html'
            },
            content: {
              templateUrl: 'app/bundle/offerBundle/template/layout.tpl.html'
            }
          }
        })

        .state('ppp.offer.nooffers', {
          url: '/no-offer',
          views: {
            'content': {
              templateUrl: 'app/bundle/offerBundle/template/no-offer-layout.tpl.html',
              controller: function (ppDialog) {
                ppDialog.openOfferTutorial();
              }
            }
          }
        })

        .state('ppp.offer.list', {
          url: '/list',
          resolve: {
            //token here to be sure that we already auth`ed
            repository: function (token, ppEntityManager) {
              return ppEntityManager.$getRepository('OfferRepository');
            },
            offers: function (token, ppEntityManager, $state, $q) {
              var repository = ppEntityManager.$getRepository('OfferRepository');
              return repository.getCurrentMerchantOffersList()
                .then(function (items) {
                  if (items.length === 0 && 'ppp.offer.nooffers' !== $state.current.name) {
                    return $state.go('ppp.offer.nooffers');
                  }

                  return $q.resolve(items);
                }).catch(function () {
                  $state.go('ppp.offer.nooffers');
                });
            },
            totalSpend: function(repository, offers){
              return repository.getTotalSpend(offers);
            }
          },
          views: {
            content: {
              controller: 'OfferlistController as offerlistController',
              templateUrl: 'app/bundle/offerBundle/template/list.tpl.html'
            }
          }
        })

        .state('ppp.offer.list.item', {
          abstract: true,
          url: '/item/:id',
          resolve: {
            offer: function(repository, $stateParams){
              return repository.$findOrCreate($stateParams.id);
            }
          }
        })
        .state('ppp.offer.list.item.edit', {
          url: '/edit',
          resolve: {
            shared: function () {
              return {};
            }
          },
          onEnter: function ($q, ppEntityManager, ppDialog, $state, $stateParams, shared, notify, offer, offers) {
            shared.dialog = ppDialog.open({
              template: 'app/bundle/offerBundle/template/edit.tpl.html',
              controller: 'OfferEditController as vm',
              className: 'popup-offer-create',
              showClose: false,
              data: {item: offer},
              preCloseCallback: function (value) {
                if (angular.isArray(value)){
                  shared.forwardTo = value[0];
                  shared.forwardToArgs = value[1];
                  return;
                }
                if (value !== 'onexit') {
                  return ppDialog.confirmClose()
                    .then(function(){
                      if (offers.length === 0){
                        shared.forwardTo = 'ppp.offer.nooffers';
                      }
                    });
                }
              }
            });
            shared.dialog.closePromise.then(function () {
              var forwardTo = shared.forwardTo || 'ppp.offer.list';
              var forwardToArgs = shared.forwardToArgs;

              delete shared.forwardTo;
              delete shared.forwardToArgs;
              $state.go(forwardTo, forwardToArgs);
            });
          },
          onExit: function (shared) {
            if (shared.dialog) { shared.dialog.close('onexit');}
          }
        })

        .state('ppp.offer.list.item.statistic', {
          url: '/statistic',
          resolve: {
            shared: function () {
              return {};
            }
          },
          onEnter: function ($q, ppEntityManager, ppDialog, $state, $stateParams, shared, notify, offer) {
            var defer = $q.defer();
            var repo = ppEntityManager.$getRepository('OfferRepository');
            repo.getOfferStatistics(offer)
              .then(function (statistic) {
                shared.dialog = ppDialog.open({
                  template: 'app/bundle/offerBundle/template/statistic.tpl.html',
                  controller: 'OfferStatisticController as vm',
                  className: 'popup-offer-statistic',
                  data: {statistic: statistic, offer: offer}
                });
                shared.dialog.closePromise.then(function () {
                  $state.go('ppp.offer.list');
                });
                defer.resolve();
              })
              .catch(function () {
                notify.error('Unable to find offer statistic');
                $state.go('ppp.offer.list');
                defer.reject();
              });

            return defer.promise;
          },
          onExit: function (shared) {
            if (shared.dialog) { shared.dialog.close('onexit');}
          }
        });

    })
    .run(
    /**
     *
     * @param {DataTransformer} dataTransformer
     */
    function (dataTransformer) {

      function offerToRejected(offer){
        if (offer.channels && offer.channels.length > 0){
           var channel = _.find(offer.channels, {status: 'REJECTED'});
          if (channel){
            offer.$$statusBackup = offer.status;
            offer.status = 'REJECTED';
          }
        }
        return offer;
      }

      function normalizeOffer(offer){
        offer.status = offer.$$statusBackup || offer.status;
        return offer;
      }

      dataTransformer.$add('offerRejectedTransformer', {
        $transform: function (offers) {
          if (angular.isArray(offers)) {
            var result = [];
            angular.forEach(offers, function (offer) {
              result.push(offerToRejected(offer));
            }, this);
            return result;
          }
          return offerToRejected(offers);
        },
        $reverseTransform: function (offers) {
          if (angular.isArray(offers)) {
            var result = [];
            angular.forEach(offers, function (offer) {
              result.push(normalizeOffer(offer));
            }, this);
            return result;
          }
          return normalizeOffer(offers);
        }
      });

    });
