/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */
  'use strict';
  angular.module('ChannelBundle')
    .controller('FreeChannelController',
    /**
     *
     * @param $scope
     * @param {Channels} channels
     * @param appConfig
     * @param ppApiTools
     * @param {PPEntityManager} ppEntityManager
     * @param moment
     * @param notify
     * @param $state
     * @param $q
     */
    function ($scope, channels, appConfig, ppApiTools, ppEntityManager, moment, notify, $state) {
      var channelProvider = $scope.channelProvider = $scope.ngDialogData.channelProvider;
      var config = channelProvider.getConfig();
      var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');

      $scope.isLoading = false;
      $scope.controls = {
        fields: config.form,
        step: 0
      };

      if ($scope.ngDialogData && $scope.ngDialogData.offer) {
        $scope.offer = $scope.ngDialogData.offer;
      }

      if ($scope.ngDialogData && $scope.ngDialogData.channel) {
        $scope.channel = $scope.ngDialogData.channel;

        var today =  moment().format('YYYY/MM/DD');

        /* set start date of campaign */
        if (moment(today).diff($scope.offer.startTime, 'days') >= 0) {
          $scope.channel.initStartDate = moment().subtract(1, 'd').format('YYYY/MM/DD'); //yesterday
        } else {
          $scope.channel.initStartDate = $scope.offer.startTime;
        }
        $scope.channel.startDate = $scope.offer.startTime;

        /* set end date of campaign */
        $scope.$watch('channel.startDate', function(){
          $scope.channel.initEndDate = moment($scope.channel.startDate).add(14, 'days').format('YYYY/MM/DD');
          $scope.channel.endDate = $scope.channel.initEndDate;
        });

        //$scope.channel.endDate = $scope.channel.endDate || $scope.offer.endTime;
        $scope.channel.name = $scope.channel.name || $scope.offer.name || $scope.offer.title;
        $scope.channel.description = $scope.channel.description || $scope.offer.description;
        $scope.channel.timeZone = $scope.channel.timeZone || $scope.offer.timeZone;
        $scope.channel.name = $scope.channel.name.length < 4 ? $scope.channel.name+'-channel' : $scope.channel.name;

        merchantRepo.getCurrentMerchantDistributionList($scope.channel.distributionChannel)
          .then(function(list){
            $scope.controls.channels = list;
          });
      }

      $scope.save = function (data, num) {
        $scope.isLoading = true;
        //@todo when backend will return linked channels to offer, need to adjust logic!!!
        var is_new_channel = false;
        if (!data.id) {
          is_new_channel = true;
        }
        data.endDate = data.startDate;

        channels.save(data)
          .then(function (channel) {
            $scope.channel.id = channel.id;
            if (is_new_channel) {
              $scope.offer.addChannel(channel)
                .then(function () {
                  //notify.success('Success', 'Free Channel was assigned to your offer');
                }).catch(function (e) {
                  notify.error('Error', e);
                });
            }
            $scope.isLoading = false;
            //notify.success('Success', 'Free Channel saved');
            $scope.next(num);
          }).catch(function (e) {
            $scope.isLoading = false;
            notify.error('Error', e);
          });
      };

      $scope.next = function (num) {
        if (num) {
          $scope.controls.step = 2;
          return;
        }
        $scope.controls.step++;
      };

      $scope.prev = function (num) {
        if (num) {
          $scope.controls.step = 0;
          return;
        }
        $scope.controls.step--;
      };

      $scope.finish = function () {

        $state.go('ppp.offer.list', null, {reload: false});
      };

      $scope.approveCampaign = function(){
        channels.changeStatus($scope.channel, channels.STATUS.APPROVED)
          .then(function(){
            //notify.success('Status changed', 'Your campaign was approved successfully');
            $state.go('ppp.offer.list', null, {reload: false});
          }).catch(function(e){
            notify.error('Unable to approve campaign', e);
          });
      };

      this.closeDialog = function(){
        if (!$scope.channel.id || $scope.channel.status === channelProvider.STATUS.INCOMPLETE && $scope.controls.step < 2){
          $scope.closeThisDialog('confirm');
        } else {
          $scope.closeThisDialog('onexit');
        }
      };
    });

