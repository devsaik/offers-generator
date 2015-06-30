/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';


angular.module('OfferBundle')
  .controller('OfferlistController', function ($scope, $state, ppEntityManager, ppBridgeEntityManager, ppDialog, repository, offers, channels, notify, $timeout, moment) {
    $scope.entities = [];
    $scope.controls = {
      displayedItems: 3
    };
    $scope.itemsPerPage = 15;
    $scope.displayedEntities = [];
    $scope.isLoading = false;
    $scope.statusFilter = '';

    var vm = this;
    var repo = ppBridgeEntityManager.$getRepositoryByEntity('lineItem');
    $scope.isLineItemsEnabled = repo.$isEnabled();

    function onOfferSaved(offer) {
      var oldOffer = _.find($scope.entities, {id: offer.id});
      $scope.entities = _.reject($scope.entities, {id: offer.id});
      $scope.controls.show = offer.id;

      var now = moment();
      offer.startTime = moment(offer.startTime).set('hour', now.get('hour'));
      offer.startTime = moment(offer.startTime).set('minute', now.get('minute'));
      offer.startTime = moment(offer.startTime).set('second', now.get('second'));

      if (oldOffer) {
        angular.extend(oldOffer, offer);
        $scope.entities.push(oldOffer);
      } else {
        $scope.entities.push(offer);
      }
      $scope.displayedEntities = angular.copy($scope.entities);
    }

    //function showAnnouncement(offerId, msg){
    //  $scope.msg = msg;
    //  $scope.controls.lastUpdatedOfferId = offerId;
    //}

    // vm.showAnnouncement into the offerCardAnnouncements directive. Ooops(
    function onOfferSaveAnnouncement(offer){
      vm.showAnnouncement(offer.id, 'Your offer was saved successfully');
    }
    function onOfferChangedStatusAnnouncement(offer){
      vm.showAnnouncement(offer.id, 'Your offer status was changed successfully');
    }
    function onCampaignChangedStatusAnnouncement(channel){
      vm.showAnnouncement(channel.linkedOffer.id, 'Your campaign status was changed successfully');
    }

    repository.addListeners(repository.EVENTS.ONCREATED, [onOfferSaved, onOfferSaveAnnouncement]);
    repository.addListeners(repository.EVENTS.ONCHANGED, [onOfferSaved, onOfferChangedStatusAnnouncement]);
    repository.addListeners(channels.EVENTS.ONSTATUSCHANGED, [onCampaignChangedStatusAnnouncement]);

    $scope.$on('$destroy', function () {
      repository.removeListeners(repository.EVENTS.ONCREATED, [onOfferSaved, onOfferSaveAnnouncement]);
      repository.removeListeners(repository.EVENTS.ONCHANGED, [onOfferSaved, onOfferChangedStatusAnnouncement]);
      repository.removeListeners(channels.EVENTS.ONSTATUSCHANGED, [onCampaignChangedStatusAnnouncement]);
    });

    this.onOfferCloned = function (offer) {
      if (offer) {
        $scope.entities.push(offer);
      } else {
        this.reload();
      }
    };

    this.loadMoreListItems = function () {
      $scope.isLoading = true;
      $scope.controls.onGroupingDone = false;
      $scope.controls.displayedItems += 3;
      $timeout(function () {
        if ($scope.controls.displayedItems < $scope.entities.length) {
          vm.loadMoreListItems();
        } else {
          $scope.isLoading = false;
        }
      }, 10);
    };



    this.onGroupingDone = function(){
      $scope.controls.onGroupingDone = true;
    };

    this.loadMoreListItems();
    this.reload = function () {
      $state.go('ppp.offer.list', null, {reload: true});
    };

    $scope.entities = offers;
    $scope.displayedEntities = angular.copy($scope.entities);
  });
