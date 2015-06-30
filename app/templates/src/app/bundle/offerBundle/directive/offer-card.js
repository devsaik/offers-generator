/**
 * Created by Nikita Yaroshevich for p3-app.
 */

'use strict';

angular.module('OfferBundle')
  .directive('offerCard', function (ppEntityManager, social, notify, ppDialog, share, $q) {
    return {
      restrict: 'A',
      require: '^?offerCardAnnouncements',
      scope: {
        offer: '=offerCard',
        message: '=',
        onShared: '&',
        onChanged: '&',
        onStatusChanged: '&',
        onCloned: '&'
      },
      templateUrl: 'app/bundle/offerBundle/template/directive/offer-card.tpl.html',
      compile: function () {
        //scope.perfomance = scope.perfomance || {};
        //scope.perfomance.compileStart = performance.now();
        return {
          pre: function () {
            //scope.perfomance = scope.perfomance || {};
            //scope.perfomance.startLink = performance.now();
          },
          post: function (scope, elem, attrs, announcementCtrl) {

            announcementCtrl.add(scope.offer.id,
              function showAnnouncement(message) {
                scope.showAnnouncement = true;
                scope.message = message;
                if (scope.offer.status !== 'ARCHIVED'){
                  angular.element('body').scrollTo(angular.element(elem));
                }
                angular.element(elem).closest('.list-offers__item').addClass('changed');
              }, function hideAnnouncement() {
                scope.showAnnouncement = false;
                angular.element(elem).closest('.list-offers__item').removeClass('changed');
              });


            scope.isFlipped = false;
            //scope.perfomance = scope.perfomance || {};
            //scope.perfomance.endLink = performance.now();
            //scope.perfomance.linkDur = scope.perfomance.endLink - scope.perfomance.startLink;
            //scope.perfomance.renderDur = scope.perfomance.end - scope.perfomance.compileStart;
            //console.log(scope.perfomance);
          }
        };
      },
      controllerAs: 'vm',
      controller: function ($scope, $state) {
        //var vm = this;
        var repository = ppEntityManager.$getRepository('OfferRepository');
        var cache = {};

        $scope.perfomance = {
          //start: performance.now()
        };
        //$scope.offer = repository.$create($scope.offer);
        //$scope.offer_next_status = $scope.offer.getNextStatus();
        $scope.$watch('offer.status', function (status, oldStatus) {
          if (!status || status === oldStatus) {
            return;
          }
          //$scope.onStatusChanged($scope.offer);
        });
        $scope.$watch('$destroy', function () {
          //announcementCtrl.remove(scope.offer.id);
        });

        this.getDetails = function () {
//            var defer = $q.defer();
          if (cache.details) {
            return $q.resolve(cache.details);
          }
          return repository.$find($scope.offer.id)
            .then(function (offer) {
              cache.details = offer;
              return $q.resolve(cache.details);
            });
//            return defer.promise;
        };

        this.getOffer = function () {
          return $scope.offer;
        };

        this.getAnalitycs = function () {
          if (cache.analitycs) {
            $q.resolve(cache.analitycs);
          }
          return repository.$find($scope.offer.id)
            .then(function (offer) {
              cache.analitycs = offer;
              return $q.resolve(cache.analitycs);
            });
        };

        this.onOfferEditClick = function (id) {
          $state.go('ppp.offer.list.item.edit', {id: id});
        };

        this.isActive = function () {
          return $scope.offer.isActive();
        };

        this.cloneOffer = function (id) {
          repository.duplicate(id)
            .then(function (res) {
              repository.$find(res.id)
                .then(function (offer) {
                  //notify.success('Offer was duplicated successfully', 'New offer title is ' + offer.title);
                  $scope.onCloned({src: $scope.offer, offer: offer, newId: res.id});
                })
                .catch(function () {
                  notify.warning('Offer was duplicated successfully', 'But was not yet ready');
                });
            })
            .catch(function (e) {
              notify.error('Unable to duplicate offer', e);
            });
        };


        this.deleteOffer = function () {
          ppDialog.confirmOffer(ppDialog.ICONS.FOLDER, 'archive offer')
            .then(function(result) {
              if (!result) {
                return;
              }

              var status = $scope.offer.status;

              repository.changeStatus($scope.offer, status, true)
                .then(function (result) {
                  //notify.success('Deleted', 'Your offer was archived successfully');
                  $scope.offer.status = result.status || status;
                }).catch(function (reason) {
                  notify.error('Unable to delete', reason);
                });
            });
        };

        this.showSpendPopup = function () {
          var channel = _.find($scope.offer.channels, function (obj) {
            return obj.type === 'DISPLAY';
          });

          ppDialog.open({
            className: 'middle popup-spend-statistics',
            templateUrl: 'app/bundle/offerBundle/template/dialog/spend-statistics.tpl.html',
            data: channel
          });
        };

        this.onCopyModalClicked = function(offer){
          ppDialog.open({
            template: 'app/bundle/offerBundle/template/dialog/copy-url.tpl.html',
            controller: 'OfferCopyUrlController as vm',
            className: 'popup-offer-copy-url',
            data: {offer: offer}
          });
        };

        //$scope.perfomance.end = performance.now();
        //$scope.perfomance.controllerDuration = $scope.perfomance.end - $scope.perfomance.start;
      }
    };
  });
