'use strict';
/**
 * @ngdoc service
 * @name cacheIt
 * @description
 * */
angular.module('EntityBundle')
  .provider('faker', function () {

    var provider = this;
    var fakerServicePrototype = null;


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

    provider.loadFaker = function (url) {
      provider.loadScript(url || 'https://raw.githubusercontent.com/Marak/faker.js/master/build/build/faker.min.js', function(){
        fakerServicePrototype = angular.extend({},fakerServicePrototype || {}, window.faker);
      });
    };


    this.$get = function ($window, $httpBackend, $parse) {

      /**
       * @class
       * @constructor
       */
      function Faker() {

      }

      Faker.prototype = {
        generated_items: {},
        registered_enpoints: {},

        linkedObjectFinder: {
          findByPk: function(data, options){
            return _.find(data, {id: options});
          }
        },

        generateObjectBySchema: function (schema) {
          var self = this;
          var result = {};

          angular.forEach(schema, function (prop, key) {
            if (angular.isObject(prop)) {
              result[key] = self.generateObjectBySchema(prop);
            } else {
              try {
                result[key] = $parse(prop)(result);
                if (!result[key]){
                  result[key] = eval(prop);
                }
              } catch (e) {
                result[key] = prop;
              }
            }

          });

          return result;
        },
        registerEndpoint: function (name, config) {
          //var url = config.url;
          this.registered_enpoints[name] = config;
         // var self = this;
          this.generated_items[name] = {};
          //angular.forEach(config, function (endpoint, key) {
          //  if (key === 'url') {
          //    return;
          //  }
          //  var method = key.toUpperCase();
          //  $httpBackend.when(method, url)
          //    .respond(function (method, url, data) {
          //      return [200, self.getItemsFor(method,url, data), {}];
          //    });
          //});
        },

        findSchemaByUrl: function(url){
          //var cfg = _.find(this.registered_enpoints, {url: url});
          //if (cfg){
          //  return cfg;
          //}

          for (var name in this.registered_enpoints) {
            if (!this.registered_enpoints.hasOwnProperty(name)){
              continue;
            }
            if (!this.registered_enpoints[name].url) {
              continue;
            }

            var regexpResult = new RegExp(this.registered_enpoints[name].url).exec(url);
            if (regexpResult !== null && regexpResult !== undefined && regexpResult.length > 0) {
              return {name: name, options: this.registered_enpoints[name]};
            }
          }
        },

        getItemsFor: function (method,url, options) {
          var cfg = this.findSchemaByUrl(url);
          var endpoint = cfg.options[method] || cfg.GET || cfg;
          var result = [];
          var self = this;

          if (endpoint.full_mirror) {
            return options.data;
          }

          if (endpoint.not_full_mirror) {
            result = self.generateObjectBySchema(endpoint.not_full_mirror);
            return angular.extend({}, options.data, result);
          }

          if (endpoint.from_cache){
            var path = endpoint.from_cache.link.split('.');
            var cache = this.generated_items[path[0]][path[1]];
            var finder = endpoint.from_cache.finder;
            return this.linkedObjectFinder[finder](cache, endpoint.from_cache.options, url);
          }

          if (endpoint.count) {
            self.generated_items[cfg.name][method] = [];
            for (var i = 0; i < endpoint.count; i++) {
              result.push(self.generateObjectBySchema(endpoint.schema));
            }
            self.generated_items[cfg.name][method] = result;
          } else {
            result = self.generateObjectBySchema(endpoint.schema);
          }

          return result;
        }
      };

      fakerServicePrototype = Faker.prototype;

      return new Faker();
    };
  });
