/**
 * Created by nilagor on 01.04.15.
 */
'use strict';
angular.module('ChannelBundle')
  .directive('adSettings', function ($rootScope, AdFileUploader, notify, ppEntityManager, channels, $q) {
    return {
      restrict: 'E',
      replace: true,
      controllerAs: 'vm',
      scope: {
        fieldsParams: '=',
        channel: '=',
        adTitle: '=',
        adDescription: '=',
        //allowEdit: '=?',
        adBannerImage: '=',
        adBannerType: '=',
        defaultBannerType: '@',
        onAdChange: '&',
        isNotValid: '='
      },
      templateUrl: 'app/bundle/channelBundle/template/directive/ad-settings.tpl.html',
      link: function ($scope) {
        //window.settingsScope = $scope; // todo WTF!!!!!!
        //console.log('adSettings created');
        //$scope.$on('$destroy', function(){
        //  console.log('adSettings destroyed');
        //});
        var adRepository = ppEntityManager.$getRepository('AdRepository');
        $scope.isImageFromServer = false;
        $scope.showGallery = true;

        if ($scope.channel.linkedAds) {
          adRepository.$find($scope.channel.linkedAds.id)
            .then(function (ad) {
              $scope.oldAd = angular.copy(ad);
              $scope.origBannerType = ad.bannerType || ad.type;

              $scope.ad = ad;
              $scope.isImageFromServer = true;
              $scope.adBannerImage = ad.getSafeUrl() || ad.base64;
              $scope.origImg = ad.getSafeUrl() || ad.base64;
              $scope.adBannerType = ad.bannerType || ad.type;
              $scope.isNotValid = !(ad.url || ad.base64);
            }).catch(function (e) {
              notify.warning('Warning', e);
            });
        } else {
          $scope.ad = adRepository.$create({
            bannerType: $scope.defaultBannerType,
            title: $scope.adTitle
          });
          $scope.adBannerType = $scope.ad.bannerType;
          $scope.isNotValid = true;
        }

        $scope.$watch('adTitle', function(val) {
          if ($scope.ad) {
            $scope.ad.title = val;
          }
        });
      },
      controller: function ($scope) {
        var adRepository = ppEntityManager.$getRepository('AdRepository');

        $scope.$on('preSaveAd', function (event, args) {
          preSaveAd(args.base64, args.callback);
        });

        $scope.$on('saveAd', function (event, args) {
          saveAd(args.callback);
        });

        $scope.$on('setOriginAdBanner', function () {
          $scope.ad = angular.copy($scope.oldAd);
          if ($scope.ad){
            $scope.adBannerImage = $scope.ad.getSafeUrl() || $scope.ad.base64;
            $scope.adBannerType =  $scope.ad.bannerType ||  $scope.ad.type;
          } else {
            $scope.adBannerImage = undefined;
          }

        });

        //$scope.$watch('adBannerType', function (val, oldVal) {
        //  if (!val) {
        //    return;
        //  }
        //
        //});

        $scope.$watch('ad.bannerType', function (val, oldVal) {
          if (!val) {
            return;
          }
          if ($scope.channel.type === 'DISPLAY') {
            var size = val.split('x');
            $scope.ad.width = size[0];
            $scope.ad.height = size[1];
          }
          $scope.adBannerType = $scope.ad.bannerType;


          $scope.adBannerImage = $scope.origImg;

          if (oldVal && val !== oldVal && val !== $scope.origBannerType) {
            $scope.onAdChange();
          }
        });

        $scope.$watch('adBannerImage', function (val) {
          if (val && !$scope.isImageFromServer && val !== $scope.origImg) {
            $scope.onAdChange();
          } else {
            $scope.isImageFromServer = false;
          }
        });

        // I dont know why, but somitimes event 'saveAd' rised twice. Should be solved when this hell will be refactored. F... events...
        var imageUploadingInProgress = false;
        function uploadImageForAd() {
          if (imageUploadingInProgress) {
            return;
          }
          var uploader = new AdFileUploader();
          var defer = $q.defer();
          delete $scope.ad.bannerImageId;
          uploader.clearQueue();
          uploader.addToQueue($scope.ad.toBlob(), {formData: {width: $scope.ad.width, height: $scope.ad.height}});

          uploader.onSuccessItem = function (fileItem, response) {
            imageUploadingInProgress = false;
            $scope.ad.url = response.url;
            $scope.ad.bannerImageId = response.id;
            $scope.isNotValid = false;
            //notify.success('Success', 'Image was successfully uploaded');
            defer.resolve();
          };
          imageUploadingInProgress = true;
          uploader.uploadAll();

          return defer.promise;
        }

        this.onImageSelected = function(image){
          $scope.origImg = image;
          $scope.onAdChange();
          //$scope.isImageFromServer = true;
          //$scope.adBannerImage = image;
        };

        /**
         * Preparing for save Ad
         * @param {string} newBase64
         * @param {Function} callback
         * @returns {boolean}
         */
        function preSaveAd(newBase64) {
          $scope.ad.type = $scope.channel.type;
          if ($scope.channel.type === 'FACEBOOK') {
            $scope.ad.title = $scope.adTitle;
            $scope.ad.body = $scope.adDescription;
          }
          if (newBase64) {
            $scope.ad.base64 = newBase64;
            $scope.ad.url = undefined;
            $scope.isNotValid = false;
          }
        }

        /**
         * Saving Ad from $scope.ad
         * @param {Function} callback
         */
        function saveAd(callback) {
          var unlinkAdId = null;
          if ($scope.channel.status === channels.STATUS.REJECTED &&  $scope.ad.id){
            unlinkAdId = $scope.ad.id;
            delete  $scope.ad.id;
          }
          var isNewAd = !$scope.ad.id;

          if ($scope.ad.url && !$scope.ad.base64) {
            if (callback instanceof Function) {
              callback();
            }
            return;
          }

          uploadImageForAd().then(function(){
              $scope.origImg = $scope.ad.getSafeUrl() || $scope.ad.base64;
              $scope.adBannerImage = $scope.ad.getSafeUrl() || $scope.ad.base64;

            adRepository.$save($scope.ad)
                .then(function (data) {
                  $scope.ad = data;
                  $scope.isValid = $scope.ad.url || $scope.ad.base64;
                  //notify.success('Success', 'AD saved');
                  if (unlinkAdId){
                    channels.unlinkAd($scope.channel, unlinkAdId);
                  }
                  if (isNewAd) {
                    channels.linkToAd($scope.channel, $scope.ad)
                        .then(function () {
                          //notify.success('Success', 'AD was assigned with your Channel');
                        }).catch(function (e) {
                          notify.error('Error', e);
                        });
                  }
                  if (callback instanceof Function) {
                    callback();
                  }
                }).catch(function (e) {
                  notify.error('Error', e);
                });
          });
        }
      }
    };
  });
