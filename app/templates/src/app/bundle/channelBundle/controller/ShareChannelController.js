/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


 'use strict';

  angular.module('ChannelBundle')
    .controller('ShareChannelController', function ($scope, channels, appConfig, notify, share, social, schemaTransformer, $state, $window) {
      $scope.channel = channels.getProvider('share');
      $scope.supportFlash = $window.FlashDetect.installed;
      $scope.disableButtons = {};
      var vm = this;
      var config = $scope.channel.getConfig();
      if ($scope.ngDialogData && $scope.ngDialogData.offer) {
        $scope.offer = $scope.ngDialogData.offer;
      }

      $scope.controls = {
        fields: config.form
      };

      $scope.shareMessages = {
        active: false,
        type: '',
        response: true //success state -> true, error state -> false
      };

      if (!$scope.offer.isActive()){
        $scope.shareMessages.type = 'disabled';
        $scope.shareMessages.active = true;
      }

      var socialFB = null;
      social.get('facebook')
        .then(function (fb) {
          socialFB = fb;
        });

      this.shareByFB = function () {
        var user;
        this.enableNavButtons();
         user = socialFB.getUser()
          .then(function () {
            vm.shareBy('facebook', $scope.offer);
          });
      };

      this.enableNavButtons = function(){
        $scope.disableButtons = {};
      };

      this.shareBy = function (name, offer) {

        offer = offer || $scope.offer;

        this.enableNavButtons();

        if (!share.isEnabled(name)) {
          notify.error('Sharing via ' + name, 'Sharing disabled');
          return;
        }
        var data = offer;
        if (config.shareSchema.offer && config.shareSchema.offer[name]) {
          data = schemaTransformer.$create(config.shareSchema.offer[name]).$transform(offer);
        }

        share.shareOffer(name, data)
          .then(function () {
            $scope.disableButtons[name] = true;

            $scope.shareMessages.active = true;
            $scope.shareMessages.type = name;
            $scope.shareMessages.response = true;
          }).catch(function () {
            $scope.shareMessages.active = true;
            $scope.shareMessages.response = false;
            $scope.shareMessages.type = name;
          });

      };

      this.onCopyClicked = function(status){
        this.enableNavButtons();
        $scope.shareMessages.type = status;
        $scope.shareMessages.active = true;
        $scope.disableButtons.copy = true;
      };

      this.onCopyToClip = function () {
        $scope.shareMessages.type = 'copy';
        $scope.shareMessages.active = true;
        $scope.shareMessages.response = true;
      };

      this.clipFallback = function () {
        $scope.shareMessages.type = 'copy';
        $scope.shareMessages.active = true;
        $scope.shareMessages.response = false;
      };

      this.finish = function () {
        $state.go('ppp.offer.list', null, {reload: false});
      };
    });

