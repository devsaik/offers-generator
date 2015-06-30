/**
 * @ngdoc service
 * @name BaseEntityManager
 * @requires $http
 * @requires $q
 * @requires $injector
 * @requires dataTransformer
 * @description
 * The EntityManager is the central access point to all features such as`communication` layer, repository
 * */
'use strict';
angular.module('EntityBundle')
  .factory('BaseEntityManager',
  ['$http', '$q', '$injector', 'dataTransformer',
   function ($http, $q, $injector, dataTransformer) {


     /**
      * @ngdoc type
      * @name BaseEntityManager
      * @description This Class manage connections to the service.
      * Creates a new EntityManager that operates on the given API connection and uses the given Configuration.
      * @constructor
      *
      */
     function BaseEntityManager() {
       /**
        * @private
        * @type     {object}
        * @property {object}   settings                EntityManager configuration
        * @property {string}   settings.endpointURL    API Base url
        * @property {string}   settings.httpOptions    Default http options
        */
       this.settings = {
         endpointURL: '',
         httpOptions: {}
       };

       /**
        *
        * @type {Array}
        * @property    {Array}     repositories    collection of loaded repositories. Currently  unused
        */
       this.repositories = [];
     }


     BaseEntityManager.prototype = {
       /**
        * @ngdoc method
        * @name BaseEntityManager#$setEndpoint
        * @description Set endpoint url
        * @param {string} url
        * @this BaseEntityManager
        * @return {BaseEntityManager}
        */
       $setEndpoint: function (url) {
         this.settings.endpointURL = url;
         return this;
       },
       /**
        * @ngdoc method
        * @name BaseEntityManager#$getEndpoint
        * @description Get endpoint url
        * @this BaseEntityManager
        * @returns {string}
        */
       $getEndpoint: function () {
         return this.settings.endpointURL;
       },

       /**
        * @ngdoc method
        * @name BaseEntityManager#$getHttpOptions
        * @description return a copy of http properties
        * @this BaseEntityManager
        * @see http://docs.angularjs.org/api/ng/service/$http
        * @returns {object}
        */
       $getHttpOptions: function () {
         return angular.copy(this.settings.httpOptions);
       },
       /**
        * @ngdoc method
        * @name BaseEntityManager#$setHttpOptions
        * @description Sets the http options
        * @this BaseEntityManager
        * @param {object}   options
        * @see http://docs.angularjs.org/api/ng/service/$http
        * @returns {BaseEntityManager}
        */
       $setHttpOptions: function (options) {
         this.settings.httpOptions = options;
         return this;
       },

       /**
        * @ngdoc method
        * @name BaseEntityManager#$addHeader
        * @description Added one header to httpOptions.headers
        * @this BaseEntityManager
        * @see http://docs.angularjs.org/api/ng/service/$http*
        * @param {string} header      Header name
        * @param {string} value       Header value
        * @returns {BaseEntityManager}
        */
       $addHeader: function (header, value) {
         this.settings.httpOptions.headers = this.settings.httpOptions.headers || {};
         this.settings.httpOptions.headers[header] = value;
         return this;
       },

       /**
        * @ngdoc method
        * @name BaseEntityManager#$getSettings
        * @description Returns EntityManager settings
        * @this BaseEntityManager
        * @return {object}   settings                EntityManager configuration
        */
       $getSettings: function () {
         return angular.copy(this.settings);
       },

       /**
        *
        * @ngdoc method
        * @name BaseEntityManager#$getDefaultEntityName
        * @description Common Entity service name. all responses and requests will be wrapped on it
        * @this BaseEntityManager
        * @return {string}   settings                EntityManager configuration
        */
       $getDefaultEntityName: function () {
         return 'BaseEntity';
       },

       /**
        * @ngdoc method
        * @this BaseEntityManager
        * @name BaseEntityManager#$getRepository
        * @description
        * Gets\Assign an repository for an entity class. If first argument is string then will try to find service\factory
        * with specified name. And try to create instance of it. Also could be an Class or Object. Anyway it should
        * implements same interfaces such as BaseEntityRepository class
        * @param {string | BaseEntityRepository | object | function }     repositoryName      should implements same interfaces such as BaseEntityRepository class
        * @param {string}                                                 [entityName]        if specified set Entity type for target repository
        * @returns {BaseEntityRepository}
        */

       $getRepository: function (repositoryName, entityName) {
         var RepositoryClass = angular.isString(repositoryName) ? $injector.get(repositoryName) : repositoryName;

         var repository = angular.isFunction(RepositoryClass) ? new RepositoryClass() : RepositoryClass;

         if (!repository) {
           throw 'RepositoryNotFoundException';
         }
         if (!angular.isFunction(repository.$setEntityManager || repository.$$setEntityType)) {
           throw 'NotValidRepositoryException';
         }
         repository.$$setEntityType(null, entityName);
         repository.$setEntityManager(this);

         return repository;
       },

       /**
        * @ngdoc method
        * @this BaseEntityManager
        * @name BaseEntityManager#$getRepositoryByEntity
        * @description
        * Gets the repository for an entity class. If first argument is string then will try to find factory
        * with specified name. And try to get repository from it. Also could be an Class or Object. Anyway it should
        * implements same interfaces such as BaseEntity class.
        * Anyway it try to catch errors and in that cases it create repository by default
        *
        *
        * @param {string | BaseEntity | function}             [entityName]            should implements same interfaces such as BaseEntity class
        * @param {string}                                     [entityRealName]        if specified an real entity name. this string will be used for API url generation
        * @returns {BaseEntityRepository}
        */
       $getRepositoryByEntity: function (entityName, entityRealName) {
         //if (!entityName) {
         //  throw 'EntityTypeNotFoundedException';
         //}
         var EntityClass = $injector.get(this.$getDefaultEntityName());
         try {
           EntityClass = angular.isString(entityName) ? $injector.get(entityName) : entityName;
         } catch (e) {
           EntityClass = $injector.get(this.$getDefaultEntityName());
         }

         var repositoryName = angular.isFunction(EntityClass) ? EntityClass.repository : EntityClass.constructor.repository;
         var repository = this.$getRepository(repositoryName);
         if (!angular.isFunction(repository.$setEntityManager || repository.$$setEntityType)) {
           throw 'NotValidRepositoryException';
         }
         repository.$$setEntityType(EntityClass, entityRealName || entityName);
         return repository;
       },


       /**
        * @ngdoc method
        * @name BaseEntityManager#$get
        * @description
        * Send a get request. Can transform request\response
        * @this BaseEntityManager
        *
        * @param {object}    options    see http://docs.angularjs.org/api/ng/service/$http and also
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @param {string | function}    options.data                  data to send
        * @returns {promise}
        */
       $get: function (options) {
         options = options || {};
         options.method = 'GET';
         return this.$$callRemote(options);
       },

       /**
        * @ngdoc method
        * @name BaseEntityManager#$delete
        * @description
        * Send a delete request. Can transform request\response
        * @this BaseEntityManager
        *
        * @param {object}    options    see http://docs.angularjs.org/api/ng/service/$http and also
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @param {string | function}    options.data                  data to send
        * @returns {promise}
        */
       $delete: function (options) {
         options = options || {};
         options.method = 'DELETE';
         return this.$$callRemote(options);
       },


       /**
        * @ngdoc method
        * @name BaseEntityManager#$post
        * @description
        * Send a post request. Can transform request\response
        * @this BaseEntityManager
        *
        * @param {object}    options    see http://docs.angularjs.org/api/ng/service/$http and also
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @param {string | function}    options.data                  data to send
        * @returns {promise}
        */
       $post: function (options) {
         options = options || {};
         options.method = 'POST';
         options.data = options.data || {};

         return this.$$callRemote(options);
       },


       /**
        * @ngdoc method
        * @name BaseEntityManager#$put
        * @description
        * Send a put request. Can transform request\response
        * @this BaseEntityManager
        *
        * @param {object}    options    see http://docs.angularjs.org/api/ng/service/$http and also
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @param {string | function}    options.data                  data to send
        * @returns {promise}
        */
       $put: function (options) {
         options = options || {};
         options.method = 'PUT';
         if (angular.isUndefined(options.data)) {
           throw 'Data should be defined';
         }
         return this.$$callRemote(options);
       },


       /**
        * @ngdoc method
        * @name BaseEntityManager#$path
        * @description
        * Send a path request. Can transform request\response
        * @this BaseEntityManager
        *
        * @param {object}    options    see http://docs.angularjs.org/api/ng/service/$http and also
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @param {string | function}    options.data                  data to send
        * @returns {promise}
        */
       $patch: function (options) {
         options = options || {};
         options.method = 'PATCH';
         if (angular.isUndefined(options.data)) {
           throw 'Data should be defined';
         }

         return this.$$callRemote(options);
       },


       /**
        *
        * @ngdoc method
        * @name BaseEntityManager#$get
        * @this BaseEntityManager
        * @description
        * Send request to API can transform request\responses
        *
        * @param {object}    options                      see http://docs.angularjs.org/api/ng/service/$http
        * @param {string | function}    options.requestTransformer    named transformer name or transformer function
        * @param {string | function}    options.responseTransformer   named transformer name or transformer function
        * @return {promise}
        */
       $$callRemote: function (options) {
         options = angular.extend(this.$getHttpOptions(), options);
         if (!options.url) {
           throw 'Url should be defined';
         }
         options.url = this.$getEndpoint() + this.$getUrl(options);
         var deferred = $q.defer();
         var self = this;

         if (options.requestTransformer) {
           options.data = dataTransformer.$chainReverseTransform(options.requestTransformer, options.data);
         }
         //if (!angular.isString(options.data)) {
         //  options.data = JSON.stringify(options.data, this.$$parseJson);
         //}
         $http(options)
           .then(function (response) {
             var data = self.$$parseResponse(response, options);
             if (options.responseTransformer) {
               data = dataTransformer.$chainTransform(options.responseTransformer, data);
             }
             deferred.resolve(data);
           })
           .catch(function (response) {
             deferred.reject(response);
           });
         return deferred.promise;
       },

       /**
        * @protected
        * @description
        * search criteria parser
        * @param {*} options
        * @returns {string}
        */
       $$applyCriteria: function (options) {
         if (options.criteria) {
           angular.forEach(options.criteria, function (v, k) {
             options.url = options.url + '&' + k + '=' + JSON.stringify(v);
           });
         }
         return options;
       },

       /**
        *
        * @ngdoc method
        * @name BaseEntityManager#$getUrl
        * @this BaseEntityManager
        * @description
        * get url
        *
        * @param {object}    options                      see http://docs.angularjs.org/api/ng/service/$http
        * @return {string}
        */
       $getUrl: function (options) {
         return options.url;
         //var url = angular.isFunction(this._urlRoot) ? this._urlRoot() : this._urlRoot ;
       },
       /**
        * @deprecated
        * @description small helper function to remove unnecessary fields like angular $$hashKey
        * @param key
        * @param value
        * @returns {*}
        */
       $$parseJson: function (key, value) {
         return (key.indexOf && key.indexOf('$$') !== -1 ) ? undefined : value;
       },

       /**
        * @ngdoc method
        * @name BaseEntityManager#$$parseResponse
        * @protected
        * @this BaseEntityManager
        * @description height level response parser to normalize data
        * @param response
        * @returns {data|*}
        */
       $$parseResponse: function (response) {
         return response.data;
       }
     };

     /**
      * @ngdoc method
      * @name BaseEntityManager#extend
      * @static
      * @this BaseEntityManager
      * @description
      * Custom implementation of OOP inhering.
      * To get access to the parent methods you can use
      * BaseEntity.prototype.parentMethod.apply(this, arguments);
      * @param {function}     ChildClass
      * @returns {function}     Class
      */
     BaseEntityManager.extend = function (ChildClass) {
       var BaseClass = this;
       angular.extend(ChildClass, BaseClass);
       ChildClass.prototype = !ChildClass.prototype ? new BaseClass() : angular.copy(ChildClass.prototype, new BaseClass());
       return ChildClass;
     };
     return BaseEntityManager;
   }]);
