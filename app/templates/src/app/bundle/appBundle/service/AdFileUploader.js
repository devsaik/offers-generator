/**
 * Created by nikita on 1/15/15.
 */


//angularFileUpload

'use strict';
angular.module('AppBundle')
  .factory('AdFileUploader',
  /**
   *
   * @param {FileUploader} FileUploader
   * @param {UserService} userService
   * @param appTools
   * @return {AdFileUploader}
   */
  function (FileUploader, userService, appTools) {
    var envOptions = appTools.getPPHttpConfig();

    /**
     * @class
     * @description
     *
     * @constructor
     */
    function AdFileUploader() {
      var headers = envOptions.httpOptions.headers || {};
      delete headers['Content-Type'];
      headers.Authorization = 'Bearer ' + userService.getToken().getKey();

      AdFileUploader.super_.call(this, {
        url: envOptions.endpointURL + '/fileupload',
        headers: headers,
        alias: 'image',
        removeAfterUpload: true
        //queueLimit: 1
        //withCredentials: true
      });

      //this.uploadItem = function(value) {
      //  var index = this.getIndexOfItem(value);
      //  var item = this.queue[index];
      //  var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';
      //
      //  item._prepareToUploading();
      //  if(this.isUploading) {
      //    return;
      //  }
      //
      //  this.isUploading = true;
      //
      //  var key = userService.getToken().getKey();
      //  item.headers = item.headers || {};
      //  item.headers.Authorization = 'Bearer ' + key;
      //
      //  this[transport](item);
      //};
    }

    FileUploader.inherit(AdFileUploader, FileUploader);


    //AdFileUploader.prototype.setAdWid = function () {/*code*/
    //};

    return AdFileUploader;
  });
