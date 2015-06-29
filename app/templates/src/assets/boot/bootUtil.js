'use strict';
$(function (window, undefined){

    var login = getParameterByName('uname');
    var pass = getParameterByName('pwd');
    function init(){
      $('.nav > a').on('click', function(event, element){
        $('.nav > a').removeClass('active');
        $(event.target).addClass('active');
      });
      activateNav();
      $(window).on('hashchange', activateNav);
    }
    function activateNav() {
      var pageName = window.location.hash.split('/')[1];
      if (!pageName) {
        return;
      }
      $('.nav > a').each(function(idx, el){
        var topic = $(el).attr('href').split('/')[1];
        if (topic === pageName){
          $(el).addClass('active');
        }
      });
  }
  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1]);
  }
  function getEnv() {
    var url = document.location.hostname;
    var env = '';
    if (url.split('.').length > 2) {
      env = url.split('.')[0];
    } else {
      env = 'prod';
    }
    return env.toUpperCase();
  }
  function authenticate(success, error){
    $.ajax({
      type: 'POST',
      /* todo:sai once the host changed then getEnv(), getPrameterByName Methods can be Removed  */
      //http://int.pushpointmobile.com/admin/api/security/authenticate
      url: '//'+ (getEnv() === 'DEV' ? 'INT' : getEnv()) +'.pushpointmobile.com/admin/api/security/oauthmock',
      //url: '//int.pushpointmobile.com/admin/api/security/oauthmock',
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        'Version': '2'
      },
      data: JSON.stringify({
        //email: login,
       // password: pass
         email: 'nikita.yaroshevich+int2@neklo.com',
         password: 'q1w2e3r4'
      })
    })
      .success(function (response) {
        if (success) {
          success(response.token, response.merchantId);
        }
      })
      .error(function (response) {
        if (error) {
          error(response);
        }
      });
  }
  init();
  window.PushpointPortableClient = function () {
    window.ppPortableLoader.init({
      elementId: 'sparkpay-app',
      env: getEnv(),
      onloaded: function () {

      },
      onerror: function () {
        //      console.log('error');
      },
      appBridge:  {},
      authenticate: authenticate
    });
  };

  var loader = {
    ENV: {
      BASE: 'pushpointmobile.com/portable/',
      DEV: '',
      DEMO: '//int.pushpointmobile.com/portable/',
      INT: '//int.pushpointmobile.com/portable/',
      STAGE: '//stage.pushpointmobile.com/portable/',
      PROD: '//pushpointmobile.com/portable/',
      QA: '//qa.pushpointmobile.com/portable/dev/'
    },
    load: function(config, callback){
      var self = this;
      var env = this.ENV[config.env.toUpperCase()] != undefined ? this.ENV[config.env.toUpperCase()] : ('//' + config.env.toLowerCase()+'.'+this.ENV.BASE);
      callback();
    },

    bootstrap: function(config, callback){
      if(!window.angular){
        callback(false);
      }
      var element = window.document.getElementById(config.elementId);
      element.setAttribute('ng-strict-di', 'ng-strict-di');
      var uiview = window.document.createElement('ui-view');
      element.innerHTML = '';
      element.appendChild(uiview);
      config.appRootUrl = this.ENV[config.env.toUpperCase()] || this.ENV.DEV;
      window.ppPortableClientCfg = config;
      //todo:sai need to remove below bootstrap line as it is already done in HTML
     // angular.bootstrap(element, [config.appName || 'PPPortable']);
      callback(true);
    }
  };

  window.ppPortableLoader = {
    init: function(config){
      if (window.sail){
        try {
          window.sail = {};
          window.offers = {};
          window.controller.spinner.hide();
          window.controller = {};
        } catch (e){

        }
      }
      setTimeout(function(){
        function retrieveNative(native) {
          var iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          var retrieved = iframe.contentWindow[native];
          document.body.removeChild(iframe);
          return retrieved;
        }
        window.Date = retrieveNative('Date');
      }, 0);

      var client = this;
      loader.load(config, function(){
        loader.bootstrap(config, function(status){
          if(status){
            if (config.onloaded){
              config.onloaded();
            }
          }else{
            if (config.onerror){
              config.onerror();
            }
          }
        });
      });
    }
  };
  window.PushpointPortableClient();
}(window));
