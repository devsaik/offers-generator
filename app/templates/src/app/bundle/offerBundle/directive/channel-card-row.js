/**
 * Created by Artyom on 3/20/2015.
 */
'use strict';
angular.module('OfferBundle')
  .directive('displayChannelCardRow',
  /**
   *
   * @param {PPDialog} ppDialog
   * @param {Channels} channels
   * @param notify
   */
  function (ppDialog, channels, notify) {
    return {
      restrict: 'A',
      scope: {
        channel: '=displayChannelCardRow',
        offerId: '@'
      },
      templateUrl: 'app/bundle/offerBundle/template/directive/display-channel-card-row.tpl.html',
      link: function (scope) {
        var icon, title, toStatus;
        scope.channel.linkedOffer = scope.channel.linkedOffer || {id: scope.offerId};
        scope.label = scope.channel.type === 'DISPLAY' ? 'Mobile Ads' : 'Facebook Ads';
        scope.changeStatus = function (status) {
          switch (status) {
            case 'approve':
              icon = ppDialog.ICONS.PLAY;
              title = 'Approve Campaign';
              toStatus = channels.STATUS.APPROVED;
              break;
            case 'play':
              icon = ppDialog.ICONS.PLAY;
              title = 'Restart Campaign';
              toStatus = channels.STATUS.RESUMED;
              break;
            case 'pause':
              icon = ppDialog.ICONS.HAND;
              title = 'Pause Campaign';
              toStatus = channels.STATUS.PAUSED;
              break;
            case 'expire':
              icon = ppDialog.ICONS.TRASH;
              title = 'Expire Campaign';
              toStatus = channels.STATUS.EXPIRED;
              break;
            case 'archive':
              icon = ppDialog.ICONS.FOLDER;
              title = 'Archive Campaign';
              toStatus = channels.STATUS.ARCHIVE;
              break;
          }

          ppDialog.confirmOffer(icon, title)
            .then(function (result) {
              if (!result) {
                return;
              }

              channels.changeStatus(scope.channel, toStatus)
                .then(function () {
                  //notify.success('Status changed', 'Your offer status was changed successfully');
                })
                .catch(function (e) {
                  notify.error('Unable to change offer status', e);
                });
            });
        };
      },
      controllerAs: 'vm',
      controller: function ($scope, ImageEntity) {
        //var vm = this;
        this.showAdPreviewPopup = function () {
          channels.find($scope.channel.id)
            .then(function (channel) {
              var image = new ImageEntity();
              image.url = channel.linkedAds.bannerUrl;
              ppDialog.open({
                className: 'popup-channel small ad-preview-popup',
                templateUrl: 'app/bundle/channelBundle/template/directive/showPreviewPopup.tpl.html',
                data: {
                  name: channel.name,
                  bannerSize: channel.linkedAds.adType.slice(5),
                  bannerUrl: image.getSafeUrl(),
                  previewSettings: {
                    enabled: false
                  }
                }
              });
            });
        };

        this.showRejectedPopup = function(){
          ppDialog.open({
            className: 'middle popup-channel-rejected',
            templateUrl: 'app/bundle/channelBundle/template/dialogs/rejected-alert.tpl.html',
            data: $scope.channel
          });
        };

        this.showSpendPopup = function () {
          var channel = {
            spend: $scope.channel.spend,
            budget: $scope.channel.budget
          };
          ppDialog.open({
            className: 'middle popup-spend-statistics',
            templateUrl: 'app/bundle/offerBundle/template/dialog/spend-statistics.tpl.html',
            data: channel
          });
        };
        function getIconState(channel, arr) {
          var result = false;

          if (Array.isArray(channel)) {
            angular.forEach(channel, function (val) {
              for (var i = 0; i < arr.length; i++) {
                if (val.status === arr[i]) {
                  result = true;
                  break;
                }
              }
            });
          } else {
            for (var i = 0; i < arr.length; i++) {
              if (channel.status === arr[i]) {
                result = true;
                break;
              }
            }
          }

          return result;
        }
        /* icons states track */
        $scope.controls = {
          icons: {
            spend: getIconState($scope.channel, ['RUNNING', 'REJECTED', 'PAUSED', 'EXPIRED', 'ARCHIVED'])
          }
        };


      }
    };
  });
