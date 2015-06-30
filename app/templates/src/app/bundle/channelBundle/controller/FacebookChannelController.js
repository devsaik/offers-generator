/**
 * Created by nilagor on 08.04.15.
 */
'use strict';
angular.module('ChannelBundle')
  .controller('FacebookChannelController',
  function($scope, $rootScope, channels, appConfig, moment, notify, $state) {
    var channelProvider = channels.getProvider('facebook');
    var config = channelProvider.getConfig();

    $scope.geo = appConfig.channelBundle.channels.facebook.form.geo;
    $scope.ages = appConfig.channelBundle.channels.facebook.form.ageGroup;
    $scope.gender = appConfig.channelBundle.channels.facebook.form.gender;

    $scope.interests = [
      {
        id: 1,
        label: 'Hop Hey Lala Lei',
        description: 'Hop Hey Lala Lei'
      },
      {
        id: 2,
        label: 'Where is questions, where is answer',
        description: 'Where is questions, where is answer'
      },
      {
        id: 3,
        label: 'Hop Hey Lala Lei',
        description: 'Hop Hey Lala Lei'
      },
      {
        id: 4,
        label: 'Whatever you said',
        description: 'Whatever you said'
      }
    ];
    $scope.behaviors = [
      {
        id: 1,
        label: 'Hop Hey Lala Lei',
        description: 'Hop Hey Lala Lei'
      },
      {
        id: 2,
        label: 'To believe, or not',
        description: 'To believe, or not'
      },
      {
        id: 3,
        label: 'Hop Hey Lala Lei',
        description: 'Hop Hey Lala Lei'
      },
      {
        id: 4,
        label: 'But god will protects you',
        description: 'But god will protects you'
      }
    ];

    $scope.isLoading = false;
    $scope.controls = {
      fields: config.form,
      //validationRules: config.validators.DisplayChannelEntity,
      step: 0
    };

    if ($scope.ngDialogData && $scope.ngDialogData.offer) {
      $scope.offer = $scope.ngDialogData.offer;
    }

    if ($scope.ngDialogData && $scope.ngDialogData.channel) {
      $scope.channel = $scope.ngDialogData.channel;
      $scope.channel.status = 'INCOMPLETE';
      $scope.channel.linkedOffer = $scope.offer;

      $scope.channel.initStartDate = moment().subtract(1, 'd').format('YYYY/MM/DD'); //yesterday;
      $scope.channel.startDate = $scope.offer.startTime;
      $scope.channel.endDate = moment($scope.channel.startDate).add(13, 'days').format('YYYY/MM/DD');
      if (moment($scope.channel.endDate).diff($scope.offer.endTime) > 0) {
        $scope.channel.endDate = $scope.offer.endTime;
      }

      $scope.channel.name = $scope.channel.name || $scope.offer.name || $scope.offer.title;
      $scope.channel.name = $scope.channel.name.length < 4 ? $scope.channel.name + '-channel' : $scope.channel.name;
      $scope.channel.description = $scope.channel.description || $scope.offer.description;
      $scope.channel.timeZone = $scope.channel.timeZone || $scope.offer.timeZone;
    }

    $scope.previewEditorSettings = {
      enabled: false,
      drawText: false,
      adTitle: '',
      adDescription: ''
    };

    $scope.enableEditor = function enableEditor() {
      $scope.previewEditorSettings.enabled = true;
    };

    $scope.disableEditor = function disableEditor() {
      $scope.previewEditorSettings.enabled = false;
    };

    $scope.cancelPreview = function () {
      $rootScope.$broadcast('setOriginAdBanner');
    };

    $scope.afterCrop = function (base64) {
      if ($scope.channel.status && $scope.channel.status !== 'INCOMPLETE') {
        $scope.next();
        return false;
      }
      $rootScope.$broadcast('saveAd', {base64: base64, callback: $scope.disableEditor});
    };

    $scope.useThisAd = function (){
      if ($scope.channel.status && $scope.channel.status !== 'INCOMPLETE') {
        $scope.next();
        return false;
      }
      $rootScope.$broadcast('saveAd', {callback: $scope.next});
    };

    $scope.save = function (data) {
      //@todo when backend will return linked channels to offer, need to adjust logic!!!
      if (data.status && data.status !== 'INCOMPLETE') {
        $scope.next();
        return false;
      }

      $scope.isLoading = true;
      var isNewChannel = !data.id;

      channels.save(data)
        .then(function (channel) {
          $scope.channel = channel;
          if (isNewChannel) {
            $scope.offer.addChannel(channel)
              .then(function () {
                //notify.success('Success', 'Display Channel was assigned to your offer');
              }).catch(function (e) {
                notify.error('Error', e);
              });
          }
          $scope.isLoading = false;
          //notify.success('Success', 'Display Channel saved');
          $scope.next();
        }).catch(function (e) {
          $scope.isLoading = false;
          notify.error('Error', e);
        });
    };

    $scope.next = function () {
      $scope.controls.step++;
    };
    $scope.prev = function () {
      $scope.controls.step--;
    };
    $scope.finish = function () {
      $state.go('ppp.offer.list', null, {reload: false});
    };

    this.closeDialog = function () {
      if ($scope.channel.status === channelProvider.STATUS.INCOMPLETE && $scope.controls.step < 3) {
        $scope.closeThisDialog('confirm');
      } else {
        $scope.closeThisDialog('onexit');
      }
    };
  });
