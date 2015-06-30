/**
 * @ngdoc service
 * @name BaseEntityRepository
 * @requires $q
 * @requires BaseEntity
 * @requires $parse
 * @description
 * An EntityRepository serves as a repository for entities with generic as well as business specific methods for retrieving entities.
 * This class is designed for inheritance and users can subclass this class to write their own repositories with business-specific methods to locate entities.
 * */
'use strict';
angular.module('EntityBundle')
  .factory('BaseEntityRepository',
  ['$q', 'BaseEntity', '$parse',
    function ($q, BaseEntity) {
      /**
       * @ngdoc type
       * @class BaseEntityRepository
       * @description This Class manage connections to the service.
       * his Class contains logic for CRUD or any other operations with models.
       * @constructor
       *
       */
      function BaseEntityRepository() {
        /**
         * @private
         * @description Base Entity type to wrap objects. By default BaseEntity used
         * @property {BaseEntity}   $$entityType      Class of the entity which serve this repository
         */
        this.$$entityType = BaseEntity;
        /**
         * @private
         * @description Required reference to EntityManager object
         * @property {BaseEntityManager}    $$entityManager     EntityManager for this repository
         */
        this.$$entityManager = null;
      }

      BaseEntityRepository.prototype = {

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$getEntityType
         * @description return Class of the entity which serve this repository
         * @this BaseEntityRepository
         * @return {BaseEntity}
         */
        $getEntityType: function () {
          return this.$$entityType;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$$setEntityType
         * @description set Class of the entity and it "Human Name"(used for url generation)
         * if entityName null, then EntityType constructor name will be used
         * @todo investigate probably will be better to remove this params
         * @this BaseEntityRepository
         *
         * @param {string | BaseEntity | function}             [entityType]        should implements same interfaces such as BaseEntity class. if none provided then will use BaseEntity
         * @param {string}                                     [entityName]        if specified an real entity name. this string will be used for API url generation
         * @return {this}
         */
        $$setEntityType: function (entityType, entityName) {
          this.$$entityType = entityType || this.$$entityType || BaseEntity;
          this.$$entityName = entityName || this.$$entityName || (entityType ? entityType.constructor.name : undefined);
          return this;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$setEntityManager
         * @description set EntityManager which serve this repository
         * @this BaseEntityRepository
         * @return {this}
         */
        $setEntityManager: function (entityManager) {
          this.$$entityManager = entityManager;
          return this;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$getEntityManager
         * @description get EntityManager for this Repository
         * @this BaseEntityRepository
         * @return {BaseEntityManager}
         */
        $getEntityManager: function () {
          return this.$$entityManager;
        },

        /**
         * @alias $getEntityManager
         * @returns {BaseEntityManager}
         */
        $getEM: function(){
          return this.$getEntityManager();
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$create
         * @description creates new Entity with init data
         * @this BaseEntityRepository
         * @return {BaseEntityManager}
         */
        $create: function (data) {
          var Entity = this.$getEntityType();
          return new Entity(data);
        },


        /**
         * @ngdoc method
         * @name BaseEntityRepository#$save
         * @description send Create\Update request to the server
         * @this BaseEntityRepository
         * @param {BaseEntity} entity
         * @param {*} [options]
         * @return {promise}
         */
        $save: function (entity, options) {
          options = options || {};
          var deferred = $q.defer();
          var method = entity.$getId() ? '$put' : '$post';
          options.data = entity;
          options.url = options.url || this.$$getEntityUrl(entity.$getId(), options);

          this.$getEntityManager()[method](options)
            .then(function(response){
              deferred.resolve(response);
            })
            .catch(function(response){
              deferred.reject(response);
            });
          return deferred.promise;
        },

//        /**
//         * @description send Create\Update request to the server
//         * @param {BaseEntity} | [{BaseEntity}] entity
//         * @param {*} options
//         * @returns {promise}
//         */
//        $bulkSave: function(entity, options){
//          options = options || {};
//          var deferred = $q.defer();
//          var entities = [];
//          if (angular.isArray(entity)) {
//            entities = entity;
//          }else{
//            entities.push(entity);
//          }
//          var self = this;
//          var count = entities.length;
//          var stats = { success : [], errors : []};
//          angular.forEach(entities, function (res) {
//            var opt = angular.copy(options);
//            opt.url = self.$$getEntityUrl(res.$getId(), options);
//            opt.data = res;
//            var method = res.$getId() ? '$put' : '$post';
//            self.$getEntityManager()[method](opt)
//              .then(function(){
//                stats.success.push(res);
//              })
//              .catch(function(){
//                stats.errors.push(res);
//              })
//              .finally(function(){
//                count--;
//                if(count === 0){
//                  deferred.resolve(stats);
//                }
//              });
//
//          });
//
//          return deferred.promise;
//        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$remove
         * @description send delete request to the server
         * @this BaseEntityRepository
         * @param {BaseEntity} entity
         * @param {*} [options]
         * @return {promise}
         */
        $remove: function (entity, options) {
          options = options || {};
          var deferred = $q.defer();
          var entities = [];
          if (angular.isArray(entity)) {
            entities = entity;
          } else {
            entities.push(entity);
          }
          var self = this;
          var count = entities.length;
          var stats = { success : [], errors : []};
          var getIdFunction = this.$create().$getId;
          angular.forEach(entities, function (res) {
            var resId = res.$getId() ||  getIdFunction.apply(res);
            if (!resId){
              count--;
              return;
            }
            var opt = angular.copy(options);
            opt.url = self.$$getEntityUrl(resId, opt);
            self.$getEntityManager().$delete(opt)
              .then(function(){
                stats.success.push(res);
              })
              .catch(function(){
                stats.errors.push(res);
              })
              .finally(function(){
                count--;
                if(count === 0){
                  deferred.resolve(stats);
                }
              });

          });

          return deferred.promise;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$find
         * @description fetch one entity from the server
         * @this BaseEntityRepository
         * @param {string} id
         * @param {*} [options]
         * @return {promise}
         */
        $find: function (id, options) {
          options = options || {};
          var deferred = $q.defer();
          var self = this;
          options.url = this.$$getEntityUrl(id, options);
          this.$getEntityManager().$get(options)
            .then(function (response) {
              var parsedData = self.$$parseResponse(response.length === 1 ? response[0] : response, options);
              var entity;
              try {
                entity = self.$create(parsedData);
              } catch (e) {
                deferred.reject('Not valid response type');
              }
              deferred.resolve(entity);
            }, deferred.reject);
          return deferred.promise;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$findOrCreate
         * @description fetch one entity from the server or create one
         * @this BaseEntityRepository
         * @param {string} id
         * @param {*} [options]
         * @return {promise}
         */
        $findOrCreate: function (id, options) {
          var self = this;
          var defer = $q.defer();
          if (id === 'new'){
            defer.resolve(self.$create({}));
          } else {
            this.$find(id, options)
              .then(function(data){
                defer.resolve(data);
              })
              .catch(function(){
                defer.resolve(self.$create({}));
              });
          }
          return defer.promise;
        },

        /**
         * @ngdoc method
         * @name BaseEntityRepository#$findBy
         * @description search entities by criteria
         * @this BaseEntityRepository
         * @param {*} criteria
         * @param {*} [options]
         * @return {promise}
         */
        $findBy: function (criteria, options) {
          options = options || {};
          options.criteria = criteria || {};
          var deferred = $q.defer();
          var self = this;
          options.url = this.$$getEntityUrl(null, options);
          this.$getEntityManager().$get(options).then(function (response) {
            var parsedData = self.$$parseResponse(response, options);
            if (angular.isArray(parsedData)) {
              var models = [];
              angular.forEach(parsedData, function (data) {
                var entity;
                try {
                  entity = self.$create(data);
                } catch (e) {
                  deferred.reject('Not valid response type');
                }
                models.push(entity);
              });
              //this.addToCollection(entityName, models);
              deferred.resolve(models);
            } else {
              deferred.reject('Not a valid response, expecting an array');
            }
          }, deferred.reject);
          return deferred.promise;
        },
        /**
         * @ngdoc method
         * @name BaseEntityRepository#$findOneBy
         * @description search one entitie by criteria
         * @this BaseEntityRepository
         * @param {*} criteria
         * @param {*} [options]
         * @return {promise}
         */
        $findOneBy: function (criteria, options) {
          options = options || {};
          options.criteria = criteria || {};
          var deferred = $q.defer();
          var self = this;
          options.criteria.l = 1;
          this.$findBy(criteria, options)
            .then(function (models) {
              deferred.resolve(self.$create(models[0]));
            })
            .catch(function () {
              deferred.reject(arguments);
            });
          return deferred.promise;
        },

        /**
         * @ngdoc method
         * @name BaseEntityManager#$$parseResponse
         * @name BaseEntityManager#$$parseResponse
         * @protected
         * @this BaseEntityRepository
         * @description height level response parser to normalize data
         * @param {*} data
         * @param {*} options
         * @returns {data|*}
         */
        $$parseResponse: function (data, options) {
          options = options || {};
          return data;
        },

        /**
         * @ngdoc method
         * @name BaseEntityManager#$$getEntityUrl
         * @protected
         * @this BaseEntityRepository
         * @description return url for entity
         * @param {string}  id
         * @param {*}       options
         * @returns {string}
         */
        $$getEntityUrl: function (id, options) {
          options = options || {};
          var url = '/' + this.$$entityName;
          if (!id) {
            return url;
          }
          return url + '/' + id;
        },

        /**
         * @ngdoc method
         * @name BaseEntityManager#$parseUrl
         * @protected
         * @this BaseEntityRepository
         * @description
         * should parse url like "/user/{{id}}/edit/{{group}}" and return it with replaced params depends of context
         * @param {string}  url
         * @param {*}       context
         * @returns {string}
         */
        $parseUrl: function (){
          throw 'Not well implemented';
          //return $interpolate(url)(context);
        }
      };

      /**
       * @ngdoc method
       * @name BaseEntityManager#extend
       * @static
       * @description
       * Custom implementation of OOP inhering
       * BaseEntity.prototype.parentMethod.apply(this, arguments);
       * @param {function}     ChildClass
       * @returns {function}     Class
       */
      BaseEntityRepository.extend = function (ChildClass) {
        var BaseClass = this;
        angular.extend(ChildClass, BaseClass);
        ChildClass.prototype = !ChildClass.prototype ? new BaseClass() : angular.copy(ChildClass.prototype, new BaseClass());
        return ChildClass;
      };

      return BaseEntityRepository;
    }]);
