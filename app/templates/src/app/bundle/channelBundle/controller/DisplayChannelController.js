/**
 * Created by Nikita Yaroshevich for ppm-portable.
 * Refactor by V. Rogalin
 */


'use strict';

angular.module('ChannelBundle')
  .controller('DisplayChannelController',
  /**
   * @param $scope
   * @param $rootScope
   * @param {userService} userService
   * @param {Channels} channels
   * @param appConfig
   * @param ppApiTools
   * @param {PPEntityManager} ppEntityManager
   * @param moment
   * @param notify
   * @param $state
   * @param {PPDialog} ppDialog
   */
  function ($scope, $rootScope, userService, channels, appConfig, ppApiTools, ppEntityManager, moment, notify, $state, ppDialog, $filter, $timeout) {
    /**
     * @type DisplayChannel
     */
    var channelProvider = channels.getProvider('display');
    var config = channelProvider.getConfig();
    var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');
    var vm = this;
    var transactionFilterSpendMap = [0, 5, 10,25, 50, 100, 250, 500, 1000, '1000+'];

    $scope.geo = appConfig.channelBundle.channels.display.entity.defaults.geo;
    $scope.geo.canGoNext = true;
    $scope.heatmapConfig = appConfig.channelBundle.channels.display.heatmap;
    $scope.showGallery = false;

    //console.log('DisplayChannelController created');
    //$scope.$on('$destroy', function(){
    //  console.log('DisplayChannelController destroyed');
    //});

    merchantRepo.getCurrentMerchantLocations()
      .then(function setMerchantLocations(locations) {
        $scope.locations = locations;
        var filter = {primary: true};
        if ($scope.channel.locationIds) {
          filter = {id: $scope.channel.locationIds};
          $scope.channel.location = _.find(locations, filter);
        } else {
          $scope.channel.location = locations[0];
        }

        var geoActiveBackup = $scope.channel.geoActive;
        $scope.channel.geoActive = 'National';
        $timeout(function(){
          $scope.channel.geoActive = geoActiveBackup;
        }, 100);
        //if ($scope.states) {
        //  filter = {label: $scope.channel.location.state};
        //  $scope.channel.location.state = _.find($scope.states, filter);
        //}
        //ppApiTools.getCities($scope.channel.location.city).then(function(res){
        //  $scope.channel.location.city = res[0];
        //});
      });


    userService.getUser().getProfile().then(function (res) {
      $scope.merchantName = res.branding.merchantName;
    });

    ppApiTools.getMetroCodes().then(function (response) {
      $scope.metro = response;
    }).catch(function () {
      $scope.metro = [];
    });
    ppApiTools.getStates().then(function (response) {
      $scope.states = response;
    }).catch(function () {
      $scope.states = [];
    });

    $scope.isLoading = false;
    $scope.controls = {
      fields: config.form,
      validationRules: config.validators.DisplayChannelEntity,
      adBannerSize: config.form.adType.options[0].value,
      showFilter: true,
      step: 0
    };

    $scope.previewEditorSettings = {
      enabled: false,
      drawText: true
    };

    if ($scope.ngDialogData && $scope.ngDialogData.offer) {
      $scope.offer = $scope.ngDialogData.offer;
    }

    if ($scope.ngDialogData && $scope.ngDialogData.totalSpend !== undefined) {
      $scope.totalSpend = $scope.ngDialogData.totalSpend;
    }


    if ($scope.ngDialogData && $scope.ngDialogData.channel) {
      $scope.channel = $scope.ngDialogData.channel;
      $scope.channel.geoActive = $scope.channel.geoActive || 'National';
      $scope.channel.linkedOffer = $scope.offer;

      $scope.channel.initStartDate = moment().subtract(20, 'd').format('YYYY/MM/DD'); //yesterday;

      if (!$scope.channel.startDate && !$scope.channel.endDate) {
        $scope.channel.startDate = $scope.offer.startTime;
        $scope.channel.endDate = moment($scope.channel.startDate).add(13, 'days').format('YYYY/MM/DD');
        if (moment($scope.channel.endDate).diff($scope.offer.endTime) > 0) {
          $scope.channel.endDate = $scope.offer.endTime;
        }
      }

      $scope.channel.name = $scope.channel.name || $scope.offer.name || $scope.offer.title;
      $scope.channel.name = $scope.channel.name.length < 4 ? $scope.channel.name + '-channel' : $scope.channel.name;
      $scope.channel.description = $scope.channel.description || $scope.offer.description;
      $scope.channel.timeZone = $scope.channel.timeZone || $scope.offer.timeZone;
    }

    $scope.$watchGroup(['channel.startDate', 'channel.endDate'], function (val) {
      if (moment(val[0]).diff(moment($scope.offer.startTime), 'days') < 0 ||
        moment(val[1]).diff(moment($scope.offer.endTime), 'days') > 0) {
        $scope.dateNotify = 'Please enter campaign dates that are within your offer dates';
      } else if (moment(val[0]).diff(moment(val[1]), 'days') === 0) {
        $scope.dateNotify = 'Caution: campaign will only run for one day';
      } else {
        $scope.dateNotify = null;
      }
    });

    //$scope.$watch('channel.location', function(){
    //  $scope.location_add_form.$setUntouched();
    //  $scope.location_add_form.$setPristine();
    //});

    //$scope.$watchGroup(['channel.budgetType', 'channel.startDate', 'channel.endDate', 'channel.totalBudget'], function(val){
    //  $scope.channel.updateBudgetsSettings();
    //});

    $scope.enableEditor = function enableEditor() {
      $scope.previewEditorSettings.enabled = true;
    };

    $scope.disableEditor = function disableEditor() {
      $scope.previewEditorSettings.enabled = false;
    };

    $scope.cancelPreview = function () {
      $rootScope.$broadcast('setOriginAdBanner');
      //$timeout(function(){ $scope.disableEditor(); }, 0);
    };

    $scope.afterCrop = function (base64) {
      if ($scope.channel.status && !($scope.channel.status === 'INCOMPLETE' || $scope.channel.status === 'REJECTED')) {
        $scope.next();
        return false;
      }
      $rootScope.$broadcast('preSaveAd', {base64: base64, callback: $scope.disableEditor});
    };

    $scope.useThisAd = function () {
      if ($scope.channel.status && !($scope.channel.status === 'INCOMPLETE' || $scope.channel.status === 'REJECTED')) {
        $scope.next();
        return false;
      }
      if ($scope.previewEditorSettings.enabled && $scope.previewEditorSettings.doSaveImage){
        $scope.previewEditorSettings.doSaveImage();
      }
      $rootScope.$broadcast('saveAd', {callback: $scope.next});
    };

    $scope.prepareGeoData = function(channel) {
      $scope.isLoading = true;
      return channels.saveGeo(channel.geoActive, channel)
        .then(function(){
          $scope.isLoading = false;
          $scope.next();
        })
        .catch(function(e){
          $scope.isLoading = false;
          notify.error('Error', e.message || e);
          $scope.geo.canGoNext = false;
        });
    };

    $scope.isWrongGeo = function() {
      switch ($scope.channel.geoActive) {
        case 'National':
          return false;
        case 'GEO':
          return !$scope.channel.location;
        case 'State':
          return !$scope.channel.location.state;
        case 'City':
          return !$scope.channel.location.city;
      }
      return false;
    };

    $scope.$watch('heatmapFilter.transactionMinIdx', function(val){
      if (!val){
        return;
      }
      $scope.heatmapFilter.transactionMinIdx = Math.round($scope.heatmapFilter.transactionMinIdx);
      $scope.heatmapFilter.transactionMin = transactionFilterSpendMap[$scope.heatmapFilter.transactionMinIdx] || 0;
    });
    $scope.$watch('heatmapFilter.transactionMaxIdx', function (val) {
      if (!val){
        return;
      }
      $scope.heatmapFilter.transactionMaxIdx = Math.round($scope.heatmapFilter.transactionMaxIdx);
      $scope.heatmapFilter.transactionMax = transactionFilterSpendMap[$scope.heatmapFilter.transactionMaxIdx] || (transactionFilterSpendMap[transactionFilterSpendMap.length -1] );
    });


    $scope.save = function (data) {
      if (data.status && !(data.status === 'INCOMPLETE' || data.status === 'REJECTED')) {
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

      if ($scope.controls.step >= 3) {
        $('.popup-channel.display').addClass('final');
      } else {
        $('.popup-channel.display').removeClass('final');
      }
    };
    $scope.prev = function () {
      $scope.controls.step--;

      if ($scope.controls.step >= 3) {
        $('.popup-channel.display').addClass('final');
      } else {
        $('.popup-channel.display').removeClass('final');
      }
    };
    $scope.finish = function () {
      vm.closeDialog(['ppp.offer.list']);
      //$state.go('ppp.offer.list', null, {reload: false});
    };

    $scope.approveCampaign = function () {
      if ($scope.channel.status && !($scope.channel.status === 'INCOMPLETE' || $scope.channel.status === 'REJECTED')) {
        return false;
      }
      channels.changeStatus($scope.channel, channels.STATUS.APPROVED)
        .then(function () {
          //notify.success('Status changed', 'Your campaign was approved successfully');
          $scope.ngDialogData.totalSpend = $scope.totalSpend + $scope.channel.totalBudget;
          vm.closeDialog(['ppp.offer.list']);
          //$state.go('ppp.offer.list', null, {reload: false});
        }).catch(function (e) {
          if (e.hasErrorCode && e.hasErrorCode('OVERSPEND_BUDGET')){
            var errors = e.httpError.data.errors;
            return vm.showOverBudgetDialog((errors && errors[0] && errors[0].message) ? errors[0].message : 'You current total campaign spend is more than $100');
          } else {
            notify.error('Error', e);
          }
        });
    };

    this.onBudgetInputFocusOut = function(){
      $scope.channel.totalBudget = + $scope.channel.totalBudget;
      if (100 - $scope.totalSpend < $scope.channel.totalBudget){
        vm.showOverBudgetDialog('You current total campaign spend is ' + $filter('currency')($scope.totalSpend + $scope.channel.totalBudget));
      }
    };

    this.showOverBudgetDialog = function(message){
      return ppDialog.open({
        template: 'app/bundle/channelBundle/template/dialogs/overbudget.tpl.html',
        className: 'middle popup-channel-overbudget',
        data: {
          message: message
        }
      });
    };

    this.onPlusClicked = function(){
      $scope.$broadcast('galleryPopup:doOpen');
    };


    this.closeDialog = function (redirect) {
      // PLAYA-1451: forms are in upper the scope
      //if ( ($scope.display_campaign_form.$dirty || $scope.display_campaign_form_ad.$dirty || $scope.display_campaign_form_map.$dirty) && $scope.channel.status === channelProvider.STATUS.INCOMPLETE && $scope.controls.step < 3) {
      if (!redirect && $scope.channel.status === channelProvider.STATUS.INCOMPLETE && $scope.controls.step < 3) {
        redirect = 'confirm';
      }
      redirect = redirect || 'onexit';



      $scope.closeThisDialog({type: redirect, callback: function(){
        $scope.$destroy();
      }});
    };

    $scope.showCustomersInfo = function () {
      ppDialog.open({
        template: 'app/bundle/channelBundle/template/dialogs/customers-info.tpl.html',
        className: 'middle capital-one'
      });
    };


    $scope.heatmapFilter = {
      categories: [],
      transactionMin: 0,
      transactionMax: 1000,
      transactionMinIdx: 0,
      transactionMaxIdx: 9,
      spendingMin: 0,
      spendingMax: 12
    };

    $scope.removeItem = function(collectionName, item) {
      $scope.channel[collectionName] = _.reject($scope.channel[collectionName], function(val) {return val.value === item.value; });
    };

    $scope.addLocation = function() {
      if ($scope.channel.location.phone === '') {
        $scope.channel.location.phone = undefined;
      }
      $scope.channel.location.id = undefined;
      ppApiTools.addLocation($scope.channel.location).then(function(responce) {
        //notify.success('Location updated', 'Your location was updated successfully');
        var id = responce.id;
        merchantRepo.getCurrentMerchantLocations()
          .then(function setMerchantLocations(locations) {
            $scope.locations = locations;
            var filter = {id: id};
            $scope.channel.location = _.find(locations, filter);
          });
      }).catch(function (e) {
        notify.error('Unable to update location', e);
      });
    };
  });
