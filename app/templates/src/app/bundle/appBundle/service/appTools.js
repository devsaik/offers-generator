'use strict';
angular.module('AppBundle')
  .provider('appTools', function () {
    if (!window.ppPortableClientCfg) {
      throw 'Pushpoint portable is not enabled';
    }
    this.appRootUrl = window.ppPortableClientCfg.appRootUrl || '';
    var env = window.ppPortableClientCfg.env.toUpperCase() || 'DEV';
    var provider = this;
    provider.getEnvName = function () {
      return env;
    };

    provider.loadScript = function (url, cb) {
      var d = window.document;
      var js = d.createElement('script');
      js.async = true;
      js.src = url;//'//connect.facebook.net/en_US/all.js';
      js.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          cb();
        }
      };
      js.onload = cb;
      d.getElementsByTagName('body')[0].appendChild(js);
    };
    provider.loadCSS = function (href, before, media) {
      // Arguments explained:
      // `href` is the URL for your CSS file.
      // `before` optionally defines the element we'll use as a reference for injecting our <link>
      // By default, `before` uses the first <script> element in the page.
      // However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
      // If so, pass a different reference element to the `before` argument and it'll insert before that instead
      // note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
      var ss = window.document.createElement('link');
      var ref = before || window.document.getElementsByTagName('script')[0];
      var sheets = window.document.styleSheets;
      ss.rel = 'stylesheet';
      ss.href = href;
      // temporarily, set media to something non-matching to ensure it'll fetch without blocking render
      ss.media = 'only x';
      // inject link
      ref.parentNode.insertBefore(ss, ref);
      // This function sets the link's media back to `all` so that the stylesheet applies once it loads
      // It is designed to poll until document.styleSheets includes the new sheet.
      function toggleMedia() {
        var defined;
        for (var i = 0; i < sheets.length; i++) {
          if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
            defined = true;
          }
        }
        if (defined) {
          ss.media = media || 'all';
        }
        else {
          setTimeout(toggleMedia, 10);
        }
      }

      toggleMedia();
      return ss;
    };


    this.$get = function ($window, appConfig, $interpolate) {
      /**
       * @class
       *
       * @constructor
       */
      function AppTools() {

      }

      /**
       *
       * @type AppTools
       */
      AppTools.prototype = {
        getEnvName: function () {
          return provider.getEnvName();
        },
        getAppRootUrl: function () {
          return provider.appRootUrl;
        },
        getPPHttpConfig: function () {
          var envOptions = appConfig.API[this.getEnvName()];
          if (envOptions) {
            return angular.copy(envOptions.PP);
          }
          envOptions = angular.copy(appConfig.API.PATTERN);
          envOptions.PP.endpointURL = $interpolate(envOptions.PP.endpointURL)({env: this.getEnvName().toLowerCase()});
          return envOptions.PP;
        },
        getProxyHttpConfig: function(){
          var envOptions = appConfig.PROXYAPI;
          if (envOptions) {
            return angular.copy(envOptions);
          }
        },
        getPPApiBaseUrl: function () {
          var apiUrl = this.getPPHttpConfig().endpointURL;
          var baseUrl = '';
          var link = $window.document.createElement('a');
          link.setAttribute('href', apiUrl);
          baseUrl = link.protocol + '//' + link.hostname + (link.port ? ':' + link.port : '');
          link = null;
          return baseUrl;
        },
        getPPPortableBridge: function () {
          return this.getPPPortableClientCfg().appBridge;
        },
        getPPPortableClientCfg: function () {
          return $window.ppPortableClientCfg;
        },
        loadScript: function (url, cb) {
          return provider.loadScript(url, cb);
        },

        loadCSS: function (href, before, media) {
          return provider.loadCSS(href, before, media);
        }

      };
      return new AppTools();
    };
    return this;
  });
