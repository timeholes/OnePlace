  angular.module('oneplace')
    .directive('repliesView', function() {
    return {
        restrict: 'E',
        scope: {
            posts: '<'
        },
        replace: true,
        templateUrl: 'templates/replies-view.html'
      };
    });