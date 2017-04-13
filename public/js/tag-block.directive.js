  angular.module('oneplace')
    .directive('tagBlock', function () {
      return {
        scope: {
          tag: '=tag'
        },
        templateUrl: 'templates/tag-block.html'
      };
    });