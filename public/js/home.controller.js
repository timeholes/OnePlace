(function () {
  'use strict';

  angular.module('oneplace')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$http', 'GetPostsService', '$cookies', 'TAGS', '$rootScope', '$scope', '$stateParams', 'ungolosFilter'];

  function HomeController($http, GetPostsService, $cookies, TAGS, $rootScope, $scope, $stateParams, ungolosFilter) {
    var ctrl = this;

    ctrl.reloadData = function (media) {
      ctrl.media = media;
      loadData();
    };

    if ($cookies.get('golos')) {TAGS['golos'] = $cookies.get('golos').split(',').map(function(tag) {return ungolosFilter(tag)})}

    if ($cookies.get('steem')) {TAGS['steem'] = $cookies.get('steem').split(',').map(function(tag) {return ungolosFilter(tag)})}

    if ($stateParams.golosTagsList || $stateParams.steemTagsList) {

      ctrl.media = $stateParams.golosTagsList ? 'golos' : 'steem';
      $cookies.put('media', ctrl.media);
      $rootScope.$broadcast('chainSet');

      var alltags = $stateParams.golosTagsList ? $stateParams.golosTagsList : $stateParams.steemTagsList;
      TAGS[ctrl.media] = alltags.split(',').map(function(tag) {return ungolosFilter(tag)});
      $cookies.put(ctrl.media, TAGS[ctrl.media]);
    } else {
      ctrl.media = $cookies.get('media') ? $cookies.get('media') : 'steem';
      $cookies.put('media', ctrl.media);
      $rootScope.$broadcast('chainSet');
    };

    $scope.rendered = true;

    $scope.$watch('rendered', function (event, data) {
      ctrl.reloadData($cookies.get('media'));
    });

    var chainWatcher = $rootScope.$on('chainSwitch', function (event, data) {
      ctrl.reloadData($cookies.get('media'));
    });

    $scope.$on('$destroy', function() {
        chainWatcher();
    });

/*     $rootScope.$on('chainSwitch', function (event, data) {
      ctrl.reloadData($cookies.get('media'));
      $rootScope.counter++;
      console.log($rootScope.counter);
    }); */

    function intTags() {
      ctrl.tags = TAGS[ctrl.media].map(function (tag) {
        return {
          name: tag,
          posts: []
        }
      });

    }

    function loadTrendingTag(n, media, next) {
      return function () {
        ctrl.tags[n].posts_loaded = false;
        $http.get('/api/' + ctrl.media + '/trending/' + TAGS[ctrl.media][n]).success(function (response) {
          setTimeout(function () {
            if (media != ctrl.media) {
              return;
            }
            ctrl.tags[n].posts_loaded = true;
            if (response.length == 0) {
              ctrl.tags[n].no_posts = true;
            }
            ctrl.tags[n].posts = response.map(function (post) {
              post.posted = GetPostsService.convertDate(post.posted);
              post.comments = GetPostsService.countReplies(post.children);
              return post;
            });
            $scope.$digest();
            next();
          }, 0);
        });
      }
    }

    function loadRecentTag(n, media, next) {
      return function () {
        ctrl.tags[n].recent_posts_loaded = false;
        $http.get('/api/' + ctrl.media + '/recent/' + TAGS[ctrl.media][n]).success(function (response) {
          setTimeout(function () {
            if (media != ctrl.media) {
              return;
            }
            var posts = response;
            ctrl.tags[n].recent_posts_loaded = true;
            for (var k = 0; k < posts.length; k++) {
              posts[k].posted = GetPostsService.convertDate(posts[k].posted);
            }
            ctrl.tags[n].recent_posts = posts;
            $scope.$digest();
            next();
          }, 0);
        });
      }
    }

    function done() {
      //DO here what we needed
    }

    function loadData() {
      intTags();
      var fn = [done];
      for (var i = TAGS[ctrl.media].length - 1; i > -1; i--) {
        fn.push(loadRecentTag(i, ctrl.media, function () {
          fn.pop()();
        }));

        fn.push(loadTrendingTag(i, ctrl.media, function () {
          fn.pop()();
        }));
      }
      fn.pop()();
    }

  };



}());
