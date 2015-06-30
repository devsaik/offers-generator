/**
 * Created by Artyom on 3/6/2015.
 */
'use strict';
angular.module('ChannelBundle')
  .directive('scheduling', function (moment, $timeout, appConfig) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/bundle/channelBundle/template/directive/scheduling-select.tpl.html',
      scope: {
        scheduling: '=ngModel'
      },
      link: function (scope, element, attrs, ctrl) {
        angular.element(element).addClass('pp-scheduling');
        scope.controls = {};
        function generateSchemaTime (start, end, step) {
          var arr = [];
          for (var i = start; i < end; i++) {
            for (var j = 0; j <= 60; j += step) {
              if (j === 60) {
                if (i === 23) {
                  j--;
                  arr.push(moment().hour(i).minute(j).format('HH:mm'));
                }
                break;
              } else {
                arr.push(moment().hour(i).minute(j).format('HH:mm'));
              }
            }
          }
          return arr;
        }
        scope.controls.schemaTime = generateSchemaTime(0,24,15);



        scope.onFocus = function (day, interval) {
          delete scope.controls.choice;
          scope.controls.choice = {};
          scope.controls.choice.index = day;
          scope.controls.choice.interval = interval;

          $timeout(function(){
            angular.element(element).find('.active select').focus();
          }, 0);
        };

        scope.onChange =  function (day, interval) {
          var _val = scope.scheduling_tmp2[day][interval];
          var sch_day = _.find(scope.scheduling, {day: day});
          if (sch_day) {
            if (!_val){
              scope.scheduling_tmp2[day][interval] =  sch_day[interval];
              return;
            }

            sch_day[interval] = _val;
          }
          scope.validate();
        };

        scope.validate = function (){
          var invalidDays = [];
          angular.forEach(scope.scheduling_tmp2, function(val, key) {
            var minutesStart = moment(val.startTime, 'HH:mm').hour()*60 + moment(val.startTime, 'HH:mm').minutes();
            var minutesEnd = moment(val.endTime, 'HH:mm').hour()*60 + moment(val.endTime, 'HH:mm').minutes();
            if (minutesEnd < minutesStart) {
              invalidDays.push(key);
              val.invalid = true;
            } else {
              val.invalid = false;
            }
          });

          if (invalidDays.length === 0) {
            ctrl.$setValidity('schedulingValidator', true);
            scope.error = false;
          } else {
            ctrl.$setValidity('schedulingValidator', false);
            scope.error = true;
          }
        };
      },
      controllerAs: 'vm',
      controller: function ($scope) {
        var schemaTypes = [
          {label: 'Everyday', val: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']},
          {label: 'Working Days', val: ['MON', 'TUE', 'WED', 'THU', 'FRI']},
          {label: 'Weekends', val: ['SAT', 'SUN']}
        ];
        $scope.types = angular.copy(appConfig.channelBundle.channels.common.form.schedulings.options);
        $scope.week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        $scope.scheduling_tmp2 = {};


        function setTypes(scheduling, arr) {
          var scheduling_arr = [];
          var scheduling_arr_tmp = [];

          if (scheduling) {
            angular.forEach(scheduling, function (key) {
              this.push(key.day);
            }, scheduling_arr_tmp);

            angular.forEach(schemaTypes[0].val, function (key) {
              if((_.indexOf(scheduling_arr_tmp, key) + 1 > 0))
              {
                this.push(key) ;
              }

            }, scheduling_arr);

            var detectCustomTime = _.find(scheduling, function(val){
              if (val.startTime !== '00:00' || val.endTime !== '23:59') {
                return true;
              }
            });

            if (detectCustomTime || $scope.type === 'Custom') {
              $scope.type = 'Custom';
            } else {
              for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                if (_.isEqual(scheduling_arr, obj.val)) {
                  $scope.type = obj.label;
                  break;
                } else {
                  $scope.type = 'Custom';
                }
              }
            }
          } else {
            $scope.type = 'Everyday';
          }
        }

        setTypes($scope.scheduling, schemaTypes);

        $scope.$watch('scheduling', function () {
          setTypes($scope.scheduling, schemaTypes);
        });

        this.toggleDay = function (day) {
          if ($scope.scheduling_tmp2[day]) {
            delete $scope.scheduling_tmp2[day];

            $scope.scheduling = _.reject($scope.scheduling, {day: day});
          } else {
            $scope.scheduling_tmp2[day] = {
              startTime: '00:00',
              endTime: '23:59'
            };
            $scope.scheduling.push({
              day: day,
              startTime:  $scope.scheduling_tmp2[day].startTime,
              endTime:  $scope.scheduling_tmp2[day].endTime
            });
          }
          $scope.validate();
        };

        $scope.$watch('type', function (type) {
          switch (type) {
            case 'Everyday':
              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings);
              break;
            case 'Working Days':
              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings).slice(0, 5);
              break;
            case 'Weekends':
              $scope.scheduling = angular.copy(appConfig.channelBundle.channels.display.entity.defaults.schedulings).slice(5);
              break;
            default:
              if ($scope.scheduling) {
                angular.forEach($scope.scheduling, function(val){
                  $scope.scheduling_tmp2[val.day] = {
                    day: val.day,
                    startTime: val.startTime,
                    endTime: val.endTime
                  };
                });
              }
              break;
          }
        });
      }
    };
  });
