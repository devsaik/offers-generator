'use strict';
/**
 * Created by nikita on 3/13/14.
 */
//'use strict';
angular.module('AppBundle')
  .factory('FakeEntityManager',
  /**
   *
   * @param $http
   * @param $q
   * @param $injector
   * @param {BaseEntityManager} BaseEntityManager
   * @return {FakeEntityManager}
   * @param {$httpBackend} $httpBackend
   * @param {Faker} faker
   */
  function ($http, $q, $injector, BaseEntityManager, $httpBackend, faker) {

    /**
     * @class
     * @extends BaseEntityManager
     * @constructor
     */
    function FakeEntityManager() {


    }


    FakeEntityManager.prototype = {
      $getDefaultEntityName: function () {
        return 'BaseEntity';
      },

      $$callRemote: function (options) {
        options = options || {};
        options.url = this.$getEndpoint() + this.$getUrl(options);
        var data = faker.getItemsFor(options.method, options.url, options);
        return $q.resolve(data);
      }

    };
    BaseEntityManager.extend(FakeEntityManager);
    return FakeEntityManager;
  }
)
;
