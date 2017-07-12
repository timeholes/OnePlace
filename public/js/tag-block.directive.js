  angular.module('oneplace')
    .directive('tagBlock', function () {
      return {
        scope: {
          tag: '=tag',
          openModal: '&'
        },
        templateUrl: 'templates/tag-block.html'
      };
    });