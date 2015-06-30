//https://github.com/sumitchawla/angularjs-filters
'use strict';
angular.module('AppBundle').filter('debug_print', [function () {
  return function (str) {
    //console.log('ch.filters.debug.print', str);
    return str;
  };
}]).filter('boolean_YesNo', [function () {
  return function (b) {
    return b === true ? 'Yes' : 'No';
  };
}]).filter('string_format', [function () {
  return function (str) {
    if (!str || arguments.length <= 1)
      return str;
    for (var i = 1; i < arguments.length; i++) {
      var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      str = str.replace(reg, arguments[i]);
    }
    return str;
  };
}]).filter('string_html2string', [function () {
  return function (str) {
    if (!str) {
      return str;
    }
    return $('<div/>').html(str).text();
  };
}]).filter('string_shorten', [function () {
  return function (str, length) {
    if (!str || !length || str.length <= length) {
      return str || '';
    }
    return str.substr(0, length) + (length <= 3 ? '' : '...');
  };
}]).filter('string_lowercase', [function () {
  return function (str) {
    return (str || '').toLowerCase();
  };
}]).filter('string_uppercase', [function () {
  return function (str) {
    return (str || '').toUpperCase();
  };
}]).filter('string_camelcase', [function () {
  return function (str) {
    return (str || '').toLowerCase().replace(/(\s.|^.)/g, function (match, group) {
      return group ? group.toUpperCase() : '';
    });
  };
}]).filter('string_trim', [function () {
  return function (str) {
    return (str || '').replace(/(^\s*|\s*$)/g, function () {
      return '';
    });
  };
}]).filter('string_trimstart', [function () {
  return function (str) {
    return (str || '').replace(/(^\s*)/g, function () {
      return '';
    });
  };
}]).filter('string_trimend', [function () {
  return function (str) {
    return (str || '').replace(/(\s*$)/g, function () {
      return '';
    });
  };
}]).filter('string_replace', [function () {
  return function (str, pattern, replacement) {
    try {
      return (str || '').replace(pattern, replacement);
    } catch (e) {
      //console.error('error in string_replace', e);
      return str || '';
    }
  };
}]).filter('math_max', [function () {
  return function (arr) {
    if (!arr)
      return arr;
    return math_max.apply(null, arr);
  };
}]).filter('math_min', [function () {
  return function (arr) {
    if (!arr)
      return arr;
    return math_min.apply(null, arr);
  };
}]).filter('array_join', [function () {
  return function (arr, seperator) {
    if (!arr)
      return arr;
    return arr.join(seperator || ',');
  };
}]).filter('array_reverse', [function () {
  return function (arr) {
    if (!arr)
      return arr;
    return arr.reverse();
  };
}])
  .filter('array_remove_empty', [function () {
    return function (arr) {
      if (!arr) {
        return arr;
      }
      var data = [];
      angular.forEach(arr, function (val) {
          if(undefined === val || null === val || (val.trim && val.trim() === '')){
            return;
          }
          data.push(val);
        }
      );
      return data;
    };
  }]);
