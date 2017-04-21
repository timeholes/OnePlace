(function () {
  "use strict";

  angular.module('oneplace')
    .service('GetPostsService', GetPostsService);

  GetPostsService.$inject = ['$http'];

  function GetPostsService($http) {
    var service = this;

    function getSuffix(number) {
      if (number == 1) {
        return 1;
      }
      if ((number % 10 == 1) && (number > 20)) {
        return 2;
      }
      if (((number % 10 == 2) || (number % 10 == 3) || (number % 10 == 4)) && ((number > 20) || (number < 10))) {
        return 3;
      }
      return 4;
    }

    service.countReplies = function (number) {
      return {
        count: number,
        suffix: 'C' + getSuffix(number)
      };
    }

    service.convertDate = function (time) {
      var minutes = Math.ceil(time / 60000);
      var hours = (minutes < 60) ? Math.floor(minutes / 60) : Math.round(minutes / 60);
      var days = Math.floor(hours / 24);

      var timePeriod = {
        count: "",
        period: ""
      };

      if (days > 1) {
        timePeriod.count = days;
        timePeriod.period = "D" + getSuffix(days);
        return timePeriod;
      }

      if (days == 1) {
        timePeriod.count = "";
        timePeriod.period = "D" + getSuffix(days);
        return timePeriod;
      }

      if (hours > 0) {
        timePeriod.count = hours;
        timePeriod.period = "H" + getSuffix(hours);
        return timePeriod;
      }

      if (minutes > 0) {
        timePeriod.count = minutes;
        timePeriod.period = "M" + getSuffix(minutes);
        return timePeriod;
      }

      return timePeriod;
    };


  }



})();