/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';
/**
 * @ngdoc module
 * @name AppBundle
 * @module AppBundle
 * @description This module contain all application wide tools, settings, directives and services
 */
  angular.module('AppBundle', [
    'config',
    'ui.router',
    'angularMoment',
    'EntityBundle',
    'ngInflection',
    'http-auth-interceptor',
    'ngCookies',
    'toaster',
    'ngSanitize',
    'ngAnimate',
    'smart-table',
    'ngDialog',
    'df.validatorBundle',
    '720kb.datepicker',
    '720kb.tooltips',
    'nsPopover',
    'angularFileUpload',
    'leaflet-directive'//'selectbox'
  ])
    .constant('angularMomentConfig', {
      timezone: window.jstz ? window.jstz.determine().name()  : 'America/Chicago'// optional
    })
    .config(function (appConfig, validatorProvider, appToolsProvider, fakerProvider) {
      validatorProvider.addCollection(appConfig.ENTITY);
      if (appToolsProvider.getEnvName() !== 'PROD'){
        fakerProvider.loadFaker(appToolsProvider.appRootUrl+'/assets/faker.min.js');
      }
    })
    .run(function AppBundleRun($rootScope, userService, social, dataTransformer, schemaTransformer, appConfig, $parse, $injector, offerValidators) {
      social.get('facebook');
      offerValidators.load();


      if (appConfig.DATATRANSFORMERS && appConfig.DATATRANSFORMERS.schemaTransformer) {
        angular.forEach(appConfig.DATATRANSFORMERS.schemaTransformer, function (cfgPath) {
          var transformers = $parse(cfgPath)(appConfig);
          if (transformers) {
            angular.forEach(transformers, function (schema, name) {
              dataTransformer.$add(name, schemaTransformer.$create(schema));
            });
          }
        });
        delete appConfig.DATATRANSFORMERS.schemaTransformer;
      }

      angular.forEach(appConfig.DATATRANSFORMERS, function(serviceName, aliasName){
        try {
          dataTransformer.$add(aliasName, $injector.get(serviceName));
        } catch (e){
          //@todo throw only in dev env
          throw e;
        }
      });
    });
