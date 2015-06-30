/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */


'use strict';
angular.module('AppBundle')
  .service('share', function ($injector, $q) {
    var providers = {};

    function Share() {

    }

    Share.prototype = {
      isEnabled: function (name) {
        try {
          return this.get(name) || false;
        } catch (e) {
          return false;
        }
      },
      $add: function (name, provider) {
        providers[name] = provider;
        return this;
      },
      $remove: function (name) {
        delete providers[name];
        return this;
      },
      get: function (name) {
        if (providers[name]) {
          return providers[name];
        }
        var ShareClassOrObject = $injector.get(name + '.share');
        if (angular.isFunction(ShareClassOrObject)) {
          ShareClassOrObject = new ShareClassOrObject();
        }
        if (!angular.isObject(ShareClassOrObject)) {
          throw 'Unsupported provider';
        }
        this.$add(name, ShareClassOrObject);
        return providers[name];
      },

      share: function (name, data) {
        var defer = $q.defer();
        try {
          this.get(name).share(data)
            .then(function (res) {
              defer.resolve(res);
            });
        } catch (e) {
          defer.reject(e);
        }
        return defer.promise;
      },


      shareOffer: function (name, offer) {
        var defer = $q.defer();
        try {
          var shareProvider = this.get(name);
          var shareMethod = (shareProvider.shareOffer ?  'shareOffer' : 'share');
          shareProvider[shareMethod](offer)
            .then(function (res) {
              defer.resolve(res);
            }).catch(function(e){
              defer.reject(e);
            });
        } catch (e) {
          defer.reject(e);
        }
        return defer.promise;
      }
    };


    return new Share();
  })

  .service('facebook.share', function (social, $http, appTools, $q) {
    function FacebookShare() {
      var facebook = social.get('facebook');
      this.share = function (data) {
        return facebook.then(function (fbSocial) {
            return fbSocial.share(data);
          });
      };


      this.shareOffer = function (offer) {
        var self = this;
        var defer = $q.defer();

        function shareIt(imageUrl){
          var defer = $q.defer();
          var sharedData = angular.copy(offer);
          sharedData.picture = imageUrl || sharedData.picture;
          self.share(sharedData)
            .then(function(result){
              defer.resolve(result);
            }).catch(function(e){
              defer.reject(e);
            });
          return defer.promise;
        }

        this.getOfferImage(offer)
          .then(function (imageUrl) {
            shareIt(imageUrl)
              .then(function(result){
                defer.resolve(result);
              }).catch(function(e){
                defer.reject(e);
              });
          })
          .catch(function () {
            shareIt()
              .then(function(result){
                defer.resolve(result);
              }).catch(function(e){
                defer.reject(e);
              });
          });
        return defer.promise;
      };

      this.getOfferImage = function (offer) {
        //
        var size = {
          width: 764,
          height: 400
        };
        var defer = $q.defer();
        var baseUrl = appTools.getPPApiBaseUrl();
        $http({
          method: 'get',
          url: baseUrl + '/search/v2/landing/offer/image?offerId=' + (offer.offerId || offer.id) + '&width=' + size.width + '&height=' + size.height
        }).then(function (response) {
          defer.resolve(response.data.imageUrl);
        }, function (response) {
          defer.reject(response);
        });
        return defer.promise;
      };
    }

    return new FacebookShare();
  })

  .service('twitter.share', function ($window, $q) {
    function TwitterShare() {
      this.share = function (data) {
        var defer = $q.defer();
        var sharedData = angular.copy(data);
        var msg = 'text=' + escape(sharedData.text);
        var url = '&url=' + escape(sharedData.link);
        var tweetUrl = 'https://twitter.com/intent/tweet?' + msg + url;
        $window.open(tweetUrl, sharedData.text, 'menubar=1,resizable=1,width=550,height=420');
        defer.resolve('shared');
        return defer.promise;
      };
    }

    return new TwitterShare();
  })


  .service('email.share', function (ppDialog, $q, $http, appTools) {
    ///
    function EmailShare() {
      this.share = function (data) {
        var defer = $q.defer();

        var dialog = ppDialog.open({
          template: 'app/bundle/appBundle/template/dialogs/email-share.tpl.html',
          className: 'input-email-dialog'
        });
        dialog.closePromise.then(function (result) {
          if (['$document','$closeButton'].indexOf(result.value) > -1) {
            return defer.reject('Canceled');
          }
          var sharedData = angular.copy(data);
          var recipients = [];
          var emails = result.value.split(',');
          sharedData.recipients = recipients.concat(emails);
          sharedData.distributionChannel = 'EMAIL';
          var baseUrl = appTools.getPPApiBaseUrl();
          $http.post(baseUrl + '/search/v2/landing/shareOffer', sharedData)
            .then(function (response) {
              defer.resolve(response.data);
            })
            .catch(function (r) {
              defer.reject(r);
            });
        });


        return defer.promise;
      };
    }

    return new EmailShare();
  })

  .service('sms.share', function (ppDialog, $q, $http, appTools) {
    ///
    function SmsShare() {
      this.share = function (data) {
        var defer = $q.defer();

        var dialog = ppDialog.open({
          template: 'app/bundle/appBundle/template/dialogs/phone-share.tpl.html',
          className: 'input-email-dialog'
        });
        dialog.closePromise.then(function (result) {
          if (['$document','$closeButton'].indexOf(result.value) > -1) {
            return defer.reject('Canceled');
          }
          var sharedData = angular.copy(data);
          var recipients = [];
          var emails = result.value.split(',');
          sharedData.recipients = recipients.concat(emails);
          sharedData.distributionChannel = 'SMS';
          var baseUrl = appTools.getPPApiBaseUrl();
          $http.post(baseUrl + '/search/v2/landing/shareOffer', sharedData)
            .then(function (response) {
              defer.resolve(response.data);
            })
            .catch(function (r) {
              defer.reject(r);
            });
        });


        return defer.promise;
      };
    }

    return new SmsShare();
  });
