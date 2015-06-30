/**
 * Created by Nikita Yaroshevich for ppm-portable.
 */

'use strict';
angular.module('AppBundle')
  .service('offerValidators',
  /**
   *
   * @param {Validator} validator
   * @param {OfferEntity} OfferEntity
   * @param {OfferRepository} OfferRepository
   * @param $q
   */
  function (validator, OfferEntity, OfferRepository) {
    function OfferValidators() {
      this.load = function () {
        //Offer custom validators

        function isNumber(n) {
          return Number(n) === n;
        }

        function isInt(n) {
          return n % 1 === 0;
        }

        validator.addRule('offer_status_map', {
          message: 'Unable to change status',
          validate: function (value, model, options) {
            if (!value) {
              throw {message: options.message || this.message};
            }
            if (model.$$status && value !== model.$$status) {
              var prevStatus = model.$$status.toLowerCase();
              if (!options.map[prevStatus] || options.map[prevStatus].indexOf(value.toLowerCase()) === -1) {
                throw {message: options.message || this.message};
              }
            }
            return true;
          }
        });

        validator.addRule('offer_redemption', {
          message: 'Please enter a number for max redemptions on the offer',
          validate: function (value, model, options) {
            if (!value) {
              throw {message: options.message || this.message};
            }
            if (!isNumber(value)) {
              throw {message: 'Please enter a numeric value (ex. 45)'};
            }
            if (!isInt(value)) {
              throw {message: 'Please enter a numeric value (ex. 45)'};
            }
            if (value < 0) {
              throw {message: 'Please enter a positive numeric value (ex. 45)'};
            }
            return true;
          }
        });

        validator.addRule('offerMinAmount', {
          message: 'Invalid offer discount',
          validate: function (value, model) {
            var typeRule = validator.getRule('type');
            if (typeRule.validate(value, model, 'positive')) {
              if (model.item && value < model.item.price) {
                throw 'Min Purchase amount cannot be less than Price of Item';
              }
            }
            return true;
          }
        });

        validator.addRule('offerMaxAmount', {
          message: 'Invalid offer discount',
          validate: function (value, model) {
            var typeRule = validator.getRule('type');
            if (typeRule.validate(value, model, 'positive')) {
              if ((model.discount.amount && model.discount.minAmount && value) && (value < model.discount.amount * model.discount.minAmount / 100)) {
                throw 'Max Discount\' cannot be less than \'Min Purchase\' * \'Discount\' / 100';
              }
            }
            return true;
          }
        });

        validator.addRule('offerDiscountAmount', {
          message: 'Invalid offer Discount Amount',
          validate: function (value, model) {
            var typeRule = validator.getRule('type');
            if (typeRule.validate(value, model, 'positive')) {
              if (model.discount.discountType === 'PERCENTAGE' && model.discount.amount > 100) {
                throw 'Discount amount cannot be more that 100%';
              }
            }
            return true;
          }
        });

        validator.addRule('offer_discount', {
          message: 'Invalid offer discount',
          validate: function (value, model) {
            var discount = model.discount;
            var type = discount.discountType;
            var discountsTypes = OfferRepository.prototype.DISCOUNTTYPES;
            var _amount = discount.amount;
            var _minAmount = discount.minAmount;
            var _maxAmount = discount.maxAmount;
            var _buy = discount.buy;
            var _get = discount.get;

            if (type === discountsTypes.PERCENTAGE || type === discountsTypes.ABSOLUTE) {
              if (!_amount) {
                throw {message: 'Please enter a Discount Amount'};
              }
              if (!_minAmount) {
                throw {message: 'Please enter a Min Purchase amount'};
              }
              if (!isNumber(_amount)) {
                throw {message: 'Please enter a numeric value for Amount'};
              }
              if (!isNumber(_minAmount)) {
                throw {message: 'Min Purchase should be a numeric value'};
              }
              if (_amount <= 0) {
                throw {message: 'Discount amount should be greater than 0'};
              }
              if (_minAmount <= 0) {
                throw {message: 'Min Purchase should be greater than 0'};
              }
              if (model.item && _minAmount < model.item.price) {
                throw {message: 'Min Purchase amount should be greater than Price of Item'};
              }
            }

            if (type === discountsTypes.PERCENTAGE) {
              if (!_maxAmount) {
                throw {message: 'Please enter a max Discount Amount'};
              }
              if (!isNumber(_maxAmount)) {
                throw {message: 'Max Purchase should be a numeric value'};
              }
              if (_maxAmount <= 0) {
                throw {message: 'Max Discount should be greater than 0'};
              }
              if (_amount > 100) {
                throw {message: 'Discount amount cannot be greater than 100%'};
              }
              if (+_maxAmount < _minAmount * _amount / 100) {
                throw {message: 'Max Discount\' cannot be less than \'Min Purchase\' * \'Discount\' / 100'};
              }
            }

            if (type === discountsTypes.ABSOLUTE) {
              if (+_minAmount < +_amount) {
                throw {message: 'Discount amount cannot be greater than Minimum Purchase'};
              }
            }

            if (type === discountsTypes.FREE) {
              if (!_minAmount) {
                throw {message: 'Please enter a Min Purchase amount'};
              }
              if (!isNumber(_minAmount)) {
                throw {message: 'Min Purchase should be a numeric value'};
              }
              if (_minAmount < 0) {
                throw {message: 'Min purchase cannot be less than 0'};
              }
              if (model.item && _minAmount < model.item.price) {
                throw {message: 'Min Purchase amount cannot be less than Price of Item'};
              }
            }

            if (type === discountsTypes.BUYGET) {
              if (!_buy || !_get) {
                throw {message: 'Please enter Buy and Get values'};
              }
              if (!isNumber(_buy) || !isNumber(_get)) {
                throw {message: 'Buy and Get values should be a numeric values'};
              }
              if (!isInt(_buy) || !isInt(_get)) {
                throw {message: 'Buy and Get values should be integer values'};
              }
              if (_buy <= 0 || _get <= 0) {
                throw {message: 'Buy and Get values should be greater than 0'};
              }
            }
            return true;
          }
        });
      };
    }

    return new OfferValidators();
  });
