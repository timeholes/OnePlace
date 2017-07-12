  angular.module('oneplace')
    .directive('postView', function() {
    return {
        restrict: 'E',
        scope: {
            show: '<',
            post: '<',
            closeModal: '&'
        },
        replace: true,
        templateUrl: 'templates/post-view.html'
      };
    });