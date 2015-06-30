/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';


  angular.module('OfferBundle')
    .controller('OfferCopyUrlController', function ($scope, $window) {
      this.offer = $scope.ngDialogData.offer;

      $scope.controls = {
        step: $window.FlashDetect.installed ? 'main' : 'noFlash'
      };
      $scope.controls.step = (!this.offer.shortUrl || !this.offer.isStatus('RUNNING')) ? 'unavailable' : $scope.controls.step;
      //!offer.shortUrl || offer.status != 'RUNNING'"


      this.onCopyToClip = function () {
        $scope.controls.step = 'copied';
      };

      this.onCopyClicked = function(){
        //$scope.shareMessages.type = 'preCopy';
        //$scope.shareMessages.active = true;
      };

      this.clipFallback = function () {
        $scope.controls.step = 'noFlash';
      };
    });
