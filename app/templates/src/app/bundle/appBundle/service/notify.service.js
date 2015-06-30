/**
 * Created by Nikita Yaroshevich for exhibition-client.
 */

'use strict';
angular.module('AppBundle')
    .service('notify', function (toaster, $filter, $sce) {

      /**
       * @class
       * @description
       * Application Notification manager
       * @constructor
       */

      /**
       * @type Notify
       */
      return {
        template: $filter('pp.message'),
        success: function (title, text) {
          text = text || '';
          toaster.pop({
            type: 'success',
            title: title,
            body: $sce.trustAsHtml(this.template(text).toString()),
            timeout: 1542,
            bodyOutputType: 'trustedHtml',
            showCloseButton: true
          });
        },
        warning: function (title, text) {
          text = text || '';
          toaster.pop({
            type: 'warning',
            title: title,
            body: $sce.trustAsHtml(this.template(text).toString()),
            timeout: 1542,
            bodyOutputType: 'trustedHtml',
            showCloseButton: true
          });
        },
        error: function (title, text) {
          text = text || '';
          toaster.pop({
            type: 'error',
            title: title,
            body: $sce.trustAsHtml(this.template(text).toString()),
            timeout: 2*60*1000,
            bodyOutputType: 'trustedHtml',
            showCloseButton: true
          });
        }
      };
    });
