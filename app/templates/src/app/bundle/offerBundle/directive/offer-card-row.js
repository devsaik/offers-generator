/**
 * Created by Artyom on 4/7/2015.
 */
'use strict';
angular.module('OfferBundle')
  .directive('offerCardRow',
  /**
   *
   * @param {PPDialog} ppDialog
   * @param {Channels} channels
   * @param notify
   */
  function (ppEntityManager, social, notify, ppDialog) {
    return {
      restrict: 'EA',
      templateUrl: 'app/bundle/offerBundle/template/directive/offer-card-row.tpl.html',
      controller: function ($scope) {
        var repository = ppEntityManager.$getRepository('OfferRepository');
        /* icons states track */
        function getIconStateByOffer (offer, arr) {
          var result = false;

          for (var i = 0; i < arr.length; i++) {
            if (offer.status === arr[i]) {
              result = true;
              break;
            }
          }

          return result;
        }
        function getIconStateByCampaign (offer, arrStatus, arrTypes) {
          var channels = offer.channels;
          var result = false;
          arrTypes = arrTypes ? arrTypes : ['DISPLAY'];

          if (!channels || channels.length === 0) {
            return false;
          }

          angular.forEach(channels, function (val) {
            for (var j = 0; j < arrTypes.length; j++) {
              for (var i = 0; i < arrStatus.length; i++) {
                if (val.status === arrStatus[i] && val.type === arrTypes[j]) {
                  result = true;
                  break;
                }
              }
            }
          });
          return result;
        }
        $scope.controls = {
          icons: {
            spend: getIconStateByCampaign($scope.offer, ['RUNNING', 'REJECTED', 'PAUSED', 'EXPIRED', 'ARCHIVED'], [
              'DISPLAY',
              'FACEBOOK'
            ]),
            edit: getIconStateByOffer($scope.offer, ['INCOMPLETE', 'PENDING', 'RUNNING', 'REJECTED', 'PAUSED']),
            attention: getIconStateByCampaign($scope.offer, ['INCOMPLETE', 'REJECTED']) && !getIconStateByOffer($scope.offer, ['INCOMPLETE', 'EXPIRED', 'ARCHIVED'])
          }
        };


        $scope.$watch('offer', function (offer) {
          $scope.controls.icons = {
            spend: getIconStateByCampaign(offer, ['RUNNING', 'REJECTED', 'PAUSED', 'EXPIRED', 'ARCHIVED'], [
              'DISPLAY',
              'FACEBOOK'
            ]),
            edit: getIconStateByOffer(offer, ['INCOMPLETE', 'PENDING', 'RUNNING', 'REJECTED', 'PAUSED']),
            attention: getIconStateByCampaign($scope.offer, ['INCOMPLETE', 'REJECTED']) && !getIconStateByOffer($scope.offer, ['INCOMPLETE', 'EXPIRED', 'ARCHIVED'])
          };
        }, true);

        $scope.changeStatus = function (status) {
          var icon, msg;
          switch (status) {
            case 'approve':
              msg = 'approve offer';
              icon = ppDialog.ICONS.PLAY;
              break;
            case 'expire':
              msg = 'expire offer';
              icon = ppDialog.ICONS.TRASH;
              break;
            case 'archive':
              msg = 'archive offer';
              icon = ppDialog.ICONS.FOLDER;
              break;
            case 'running':
              msg = 'restart offer';
              icon = ppDialog.ICONS.PLAY;
              break;
            case 'pause':
              msg = 'pause offer';
              icon = ppDialog.ICONS.HAND;
              break;
          }

          ppDialog.confirmOffer(icon, msg)
            .then(function (result) {
              if (!result) {
                return;
              }

              repository.changeStatus($scope.offer, status)
                .then(function (result) {
                  //notify.success('Status changed', 'Your offer status was changed successfully');
                  $scope.offer.status = result.status || repository.STATUS.ARCHIVE;
                }).catch(function (e) {
                  notify.error('Unable to change offer status', e);
                });
            });
        };




      }
    };
  });
