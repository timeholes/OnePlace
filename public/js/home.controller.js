(function () {
  'use strict';

  angular.module('oneplace')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$http', 'GetPostsService', '$cookies', 'DEFAULT_TAGS', '$rootScope', '$scope', '$stateParams', 'ungolosFilter'];

  function HomeController($http, GetPostsService, $cookies, DEFAULT_TAGS, $rootScope, $scope, $stateParams, ungolosFilter) {
    var ctrl = this;
    var TAGS = {golos:[]};
    ctrl.reloadData = function (media) {
      $cookies.put('media', media);
      ctrl.media = media;
      loadData();
    };

    if ($stateParams.userTagsList) {
      var rawtags = $stateParams.userTagsList.split(',');  
      TAGS['golos'] = rawtags.map(function(tag) {return ungolosFilter(tag)});
      console.log(TAGS['golos']);
      ctrl.reloadData('golos');
    } else {
      TAGS['golos'] = DEFAULT_TAGS['golos'];
      if (!$cookies.get('media')) {
        $cookies.put('media', 'golos');
      }
      ctrl.media = $cookies.get('media') ? $cookies.get('media') : 'golos';
      ctrl.tags = TAGS[ctrl.media];
    };

    console.log(ctrl.tags);

    $scope.rendered = true;

    $scope.$watch('rendered', function (event, data) {
      ctrl.reloadData($cookies.get('media'));
    });


    $rootScope.$on('chainSwitch', function (event, data) {
      ctrl.reloadData($cookies.get('media'));
    });

    function intTags() {
      ctrl.tags = TAGS[ctrl.media].map(function (tag) {
        return {
          name: tag,
          posts: []
        }
      });
    }

    function loadTrandingTag(n, media, next) {
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

        fn.push(loadTrandingTag(i, ctrl.media, function () {
          fn.pop()();
        }));
      }
      fn.pop()();
    }

  };



}());