(function () {
  'use strict';


  angular.module('oneplace').directive('onePageNav', onePageNav);

  onePageNav.$inject = ['$timeout', '$rootScope'];

  function onePageNav($timeout, $rootScope) {
    return {
      restrict: 'EA',
      scope: {
        items: '=',
        liTrigger: '=',
        options: '='
      },
      replace: true,
      template: '\
      <nav class="sidebar__nav">\
        <ul class="sidebar__nav-list">\
          <li ng-repeat="item in items" ng-click="handleClick($event)">\
            <a class="sidebar__nav-link" ng-href="#{{ item.name }}" ng-bind="item.name | golos | capitalize" title="{{ item.name | golos | capitalize}}"></a>\
          </li>\
        </ul>\
      </nav>\
    ',
      link: function (scope, iElm, iAttrs) {
        var api, elmDestroyed, dereg;

        scope.handleClick = function ($evt) {
          if (api && !!scope.liTrigger) {
            $($evt.currentTarget).find('a').trigger('click.onePageNav');
          }
        };

        scope.$watchCollection('items', function () {
          if (api) {
            api.destroy();
          }

          $timeout(function () {
            var options = scope.options || {},
              apiDataName = options.apiDataName || 'onePageNav';
            if (!elmDestroyed) {
              api = iElm.find('ul').onePageNav(options).data(apiDataName);
              api.scrollChange();
            }
          });
        });

        dereg = $rootScope.$on('jqOnePageNav.scrollTo', function ($evt, target) {
          if (api) {
            api.scrollTo('#' + target);
          }
        });

        iElm.bind('$destroy', function () {
          elmDestroyed = true;
          if (api) {
            api.destroy();
          }
          if (dereg) {
            dereg();
          }
        });
      }
    };
  }

})();