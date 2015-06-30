///**
// * Created by Artyom on 3/6/2015.
// */
//angular.module('ChannelBundle')
//  .directive('scheduling', function (moment, $timeout, appConfig) {
//    return {
//      restrict: 'E',
//      require: 'ngModel',
//      templateUrl: 'app/bundle/channelBundle/template/directive/scheduling.tpl.html',
//      scope: {
//        scheduling: '=ngModel'
//      },
//      link: function (scope, element, attrs, ctrl) {
//        angular.element(element).addClass('pp-scheduling');
//        scope.controls = {};
//        scope.controls.schemaTime = generateSchemaTime(0,24,15);
//
//        function generateSchemaTime (start, end, step) {
//          var arr = [];
//
//          for (var i = start; i < end; i++) {
//            for (var j = 0; j < 60; j += step) {
//              arr.push(moment().hour(i).minute(j).format('HH:mm'));
//            }
//          }
//
//          return arr;
//        }
//
//        scope.onFocus = function (day, interval) {
//          delete scope.controls.choice;
//          scope.controls.choice = {};
//          scope.controls.choice.index = day;
//          scope.controls.choice.interval = interval;
//
//          $timeout(function(){
//            angular.element(element).find('.active input[type="time"]').focus();
//          }, 0);
//        };
//
//        scope.onBlur = function (day, interval) {
//          var _val = scope.scheduling_tmp2[day][interval];
//          var sch_day = _.find(scope.scheduling, {day: day});
//          if (sch_day) {
//            if (!_val){
//              scope.scheduling_tmp2[day][interval] =  moment(sch_day[interval], 'HH:mm').toDate();
//              return;
//            }
//
//            sch_day[interval] = moment(_val).format('HH:mm');
//          }
//          scope.validate();
//        };
//
//        scope.validate = function (){
//          var invalidDays = [];
//
//          angular.forEach(scope.scheduling_tmp2, function(val, key) {
//            var minutesStart = moment(val.startTime, 'HH:mm a').minutes();
//            var minutesEnd = moment(val.endTime, 'HH:mm a').minutes();
//            if (minutesEnd < minutesStart) {
//              invalidDays.push(key);
//              val.invalid = true;
//            } else {
//              val.invalid = false;
//            }
//          });
//
//          if (invalidDays.length === 0) {
//            ctrl.$setValidity('schedulingValidator', true);
//            scope.error = false;
//          } else {
//            ctrl.$setValidity('schedulingValidator', false);
//            scope.error = true;
//          }
//        };
//      },
//      controllerAs: 'vm',
//      controller: function ($scope) {
//        var schemaTypes = [
//          {label: 'Everyday', val: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']},
//          {label: 'Working Days', val: ['MON', 'TUE', 'WED', 'THU', 'FRI']},
//          {label: 'Weekends', val: ['SAT', 'SUN']}
//        ];
//        $scope.types = angular.copy(appConfig.channelBundle.channels.common.form.schedulings.options);
//        $scope.week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//        $scope.scheduling_tmp2 = {};
//
//
//        function setTypes(scheduling, arr) {
//          var scheduling_arr = [];
//          var scheduling_arr_tmp = [];
//
//          if (scheduling) {
//            angular.forEach(scheduling, function (key) {
//              this.push(key.day);
//            }, scheduling_arr_tmp);
//
//            angular.forEach(schemaTypes[0].val, function (key) {
//              (_.indexOf(scheduling_arr_tmp, key) + 1 > 0) ? this.push(key) : false;
//            }, scheduling_arr);
//
//            var detectCustomTime = _.find(scheduling, function(val){
//              if (val.startTime !== '00:00' || val.endTime !== '23:59') {
//                return true;
//              }
//            });
//
//            if (detectCustomTime || $scope.type === 'Custom') {
//              $scope.type = 'Custom';
//            } else {
//              for (var i = 0; i < arr.length; i++) {
//                var obj = arr[i];
//                if (_.isEqual(scheduling_arr, obj.val)) {
//                  $scope.type = obj.label;
//                  break;
//                } else {
//                  $scope.type = 'Custom';
//                }
//              }
//            }
//          } else {
//            $scope.type = 'Everyday';
//          }
//        }
//
//        setTypes($scope.scheduling, schemaTypes);
//
//        $scope.$watch('scheduling', function () {
//          setTypes($scope.scheduling, schemaTypes);
//        });
//
//        this.toggleDay = function (day) {
//          if ($scope.scheduling_tmp2[day]) {
//            delete $scope.scheduling_tmp2[day];
//
//            $scope.scheduling = _.reject($scope.scheduling, {day: day});
//          } else {
//            $scope.scheduling_tmp2[day] = {
//              startTime: moment('00:00', 'HH:mm').toDate(),
//              endTime: moment('23:59', 'HH:mm').toDate()
//            };
//            $scope.scheduling.push({
//              day: day,
//              startTime:  moment($scope.scheduling_tmp2[day].startTime).format('HH:mm'),
//              endTime:  moment($scope.scheduling_tmp2[day].endTime).format('HH:mm')
//            });
//          }
//          $scope.validate();
//        };
//
//        $scope.$watch('type', function (type) {
//          switch (type) {
//            case 'Everyday':
//              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings);
//              break;
//            case 'Working Days':
//              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings).slice(0, 5);
//              break;
//            case 'Weekends':
//              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings).slice(5);
//              break;
//            default:
//              if ($scope.scheduling) {
//                angular.forEach($scope.scheduling, function(val){
//                  $scope.scheduling_tmp2[val.day] = {
//                    day: val.day,
//                    startTime: moment(val.startTime, 'HH:mm').toDate(),
//                    endTime: moment(val.endTime, 'HH:mm').toDate()
//                  };
//                });
//              }
//              break;
//          }
//        });
//      }
//    };
//  });