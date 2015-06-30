/**
 * Created by Nikita Yaroshevich for p3-app.
 */
'use strict';


angular.module('OfferBundle')
  .controller('OfferEditController',
  /**
   *
   * @param $scope
   * @param {PPEntityManager} ppEntityManager
   * @param {PPBridgeManager} ppBridgeEntityManager
   * @param {Validator} validator
   * @param ppDialog
   * @param $q
   * @param $state
   * @param notify
   * @param $filter
   * @param appConfig
   */
  function ($scope, ppEntityManager, ppBridgeEntityManager, validator, ppDialog, $q, $state, notify, $filter, appConfig, moment, OfferEntity, $timeout) {
    window.scope = $scope;
    /**
     *
     * @type {OfferRepository}
     */
    var offerRepo = ppEntityManager.$getRepository('OfferRepository');
    var merchantRepo = ppEntityManager.$getRepository('MerchantRepository');


    var lineItemsRepo = ppBridgeEntityManager.$getRepositoryByEntity('LineItemEntity', 'lineItem');

    $scope.controls = {
      activePanel: 'offer',
      lineItem: {},
      timezones: appConfig.CONSTANTS.timezones,
      fields: appConfig.offerBundle.form,
      offerMinDate: moment().subtract(1, 'd').format('YYYY/MM/DD')
    };

    //$scope.today = moment().subtract(1, 'days').format('YYYY-MM-DD');

    if ($scope.ngDialogData && $scope.ngDialogData.item) {
      $scope.item = $scope.ngDialogData.item instanceof OfferEntity ? $scope.ngDialogData.item : offerRepo.$create($scope.ngDialogData.item);
    } else {
      $scope.item = offerRepo.$create();
    }
    $scope.is_new = $scope.item.$getId() === undefined;
    $scope.validationRules = validator.getValidationRules('offer');
    $scope.isLoading = true;


    $q.all([
      merchantRepo.getCurrentMerchantLocations()
        .then(function (locations) {
          $scope.locations = locations;
        }),
      offerRepo.loadDefaultTo($scope.item)
        .then(function (o) {
          $scope.item = o;
        })
    ])
      .catch(function () {
        notify.error('Ooops! Internal server error', 'Please try again later');
        $state.go('ppp.offer.list');
      })
      .finally(function () {
        $scope.item.location = $scope.locations[0];
        $scope.isLoading = false;
        //sorry for this...
        $timeout(function () {
          $scope.offer_form.$setPristine();
          $scope.offer_form.$setUntouched();
        }, 100);
      });

    $scope.isLineItemsEnabled = lineItemsRepo.$isEnabled();
    if ($scope.isLineItemsEnabled) {
      lineItemsRepo.$findBy()
        .then(function (items) {
          $scope.lineItems = items;
        }).catch(function () {
          notify.warning('Line Items unavailable', 'Please try again later');
          $scope.isLineItemsEnabled = false;
        });
    }

    this.onLineItemSaveClick = function (line_item) {
      $scope.item.line_items = [
        {'index': 0}
      ];
      $scope.item.item = line_item;
      $scope.controls.activePanel = 'offer';
    };

    this.onLineItemRemoveClick = function (editableField) {
      if (editableField) {
        return;
      }
      delete $scope.item.line_items;
      delete $scope.item.item;
      $scope.controls.activePanel = 'offer';
    };

    this.onAddLineItemClick = function (editableField) {
      if (editableField) {
        return;
      }
//        if ($scope.item.item){
//          $scope.controls.lineItem = $scope.item.item;
//          $scope.controls.activePanel = 'add_item';
//          return;
//        }
      $scope.controls.activePanel = 'choose_item';// $scope.isLineItemsEnabled ? 'choose_item' : 'add_item';
      $scope.panelTitle = 'Associate Items';
    };


    this.onBackClick = function (panel) {
      if ($scope.isLineItemsEnabled && panel === 'add_item') {
        $scope.controls.activePanel = 'choose_item';
        $scope.panelTitle = 'Associate Items';
        return;
      }
      $scope.controls.activePanel = 'offer';
    };

    this.onLineItemChooseClick = function (id) {
      var i = _.find($scope.lineItems, {id: id});
      if (i) {
        $scope.controls.lineItem = i;
        return this.onLineItemSaveClick($scope.controls.lineItem);
//          $scope.controls.activePanel = 'add_item';
      } else {
        notify.warning('Unable to attach item', 'Please select another one');
      }
    };

    this.submit = function (data, approve) {
      delete $scope.errorHtml;
      $scope.isLoading = true;
      if (!data.item || !data.line_items) {
        data.item = null;
        data.line_items = [{index: 0}];
      }
      //var isNewOne = !data.id;

      if (!approve) {
        offerRepo.$save(data)
          .then(function () {
            //notify.success('Saved', 'Your offer was saved successfully');
            //if (data.status === offerRepo.STATUS.RUNNING){
            if (['PAUSED', offerRepo.STATUS.PENDING,offerRepo.STATUS.RUNNING].indexOf(data.status) !== -1){
              $scope.closeThisDialog(['ppp.offer.list.item.channels', {id: data.id}]);
            }
            $scope.closeThisDialog('onexit');
          })
          .catch(function (reason) {
            notify.error('Unable to save offer', reason);
            $scope.errorHtml = $filter('pp.message')(reason);
            $scope.isLoading = false;
          });
      } else {
        offerRepo.$saveAndApprove(data)
          .then(function (offer) {
            //notify.success('Saved', 'Your offer was saved successfully');
            $scope.closeThisDialog(['ppp.offer.list.item.channels', {id: offer.id}]);

            //if (isNewOne) {
            //  //$state.go();
            //  $scope.closeThisDialog(['ppp.offer.list.item.channels', {id: offer.id}]);
            //  return;
            //}
            //$state.go('ppp.offer.list', null);
            //$scope.closeThisDialog('onexit');
          })
          .catch(function (reason) {
            notify.error('Unable to save offer', reason);
            $scope.errorHtml = $filter('pp.message')(reason);
            $scope.isLoading = false;
          });
      }
    };

    this.closeDialog = function (redirect) {
      redirect = redirect || 'confirm';
      if (!$scope.offer_form.$dirty || $scope.item.status === 'EXPIRED' || $scope.item.status === 'ARCHIVED') {
        redirect = 'onexit';
      }
      $scope.closeThisDialog(redirect);
    };
  });
