/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';


  angular.module('OfferBundle')
    .controller('OfferStatusController', function ($scope, ppEntityManager, validator, ppDialog, $q, notify) {
      var offerRepo = ppEntityManager.$getRepository('OfferRepository');
      $scope.controls = {
        status: 'INCOMPLETE'
      };
      if ($scope.ngDialogData && $scope.ngDialogData.offer) {
        $scope.offer = offerRepo.$create($scope.ngDialogData.offer);
        $scope.controls.status = $scope.offer.status;
      }

      $scope.status_list = offerRepo.STATUS;

      this.save = function (status) {
        $scope.offer.setStatus(status);
        offerRepo.changeStatus($scope.offer, status)
          .then(function (offer) {
            $scope.closeThisDialog(offer);
          })
          .catch(function (reason) {
            notify.error('Unable to save offer', reason);
          });
      };

    });
