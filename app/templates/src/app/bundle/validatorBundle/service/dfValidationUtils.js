/**
 * Created by nikita
 */
'use strict';
(function () {

	/**
	 * Some of the code below was filched from https://github.com/bvaughn/angular-form-for
	 */
	angular.module('df.formBundle')
		.service('dfValidationUtils', function () {
			function dfValidationUtils() {

			}

			dfValidationUtils.prototype = {
				/**
				 * Crawls an object and returns a flattened set of all attributes using dot notation.
				 * This converts an Object like: {foo: {bar: true}, baz: true}
				 * Into an Array like ['foo', 'foo.bar', 'baz']
				 * @param {Object} object Object to be flattened
				 * @returns {Array} Array of flattened keys (perhaps containing dot notation)
				 */
				flattenObjectKeys: function (object) {
					var keys = [];
					var queue = [
						{
							object: object,
							prefix: null
						}
					];

					while (true) {
						if (queue.length === 0) {
							break;
						}

						var data = queue.pop();
						var prefix = data.prefix ? data.prefix + '.' : '';

						if (typeof data.object === 'object') {
							for (var prop in data.object) {
								var path = prefix + prop;

								keys.push(path);

								queue.push({
									object: data.object[prop],
									prefix: path
								});
							}
						}
					}

					return keys;
				}
			};

			return new dfValidationUtils();
		});
})();
