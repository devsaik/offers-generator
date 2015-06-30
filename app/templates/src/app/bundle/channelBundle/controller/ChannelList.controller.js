/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';


  angular.module('ChannelBundle')
    .controller('ChannelListController',
    /**
     *
     * @param $scope
     * @param {Channels} channels
     * @param $state
     */
    function ($scope, channels) {
      $scope.channels = channels.getAvailableProviders();

      if ($scope.ngDialogData && $scope.ngDialogData.offer) {
        $scope.offer = $scope.ngDialogData.offer;
      }

      $scope.isChannelAvailable = function(ch, distributionChannel) {
        //var byType = _.where($scope.offer.channels, {type: ch.getName().toUpperCase()});
        var byDistribution = _.where($scope.offer.channels, {type: ch.getName().toUpperCase(), distributionChannel: distributionChannel});
        return byDistribution.length;
      };

      //$scope.addChannel = function(name){
      //  $state.go('ppp.offer.list.item.channel', {id: $scope.offer.id, name: name});
      //};
    });
