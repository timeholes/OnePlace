(function () {
  'use strict';

  angular.module('oneplace')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$http', 'GetPostsService', '$cookies', 'TAGS', '$rootScope', '$scope', '$stateParams', 'ungolosFilter', 'golosFilter', 'uuid2'];

  function HomeController($http, GetPostsService, $cookies, TAGS, $rootScope, $scope, $stateParams, ungolosFilter, golosFilter, uuid2) {
    var ctrl = this;

    ctrl.reloadData = function (media) {
      ctrl.media = media;
      loadData();
    };

    if ($cookies.get('golos')) {
      TAGS['golos'] = $cookies.get('golos').split(',').map(function (tag) {
        return ungolosFilter(tag)
      })
    }

    if ($cookies.get('steem')) {
      TAGS['steem'] = $cookies.get('steem').split(',').map(function (tag) {
        return ungolosFilter(tag)
      })
    }

    if ($stateParams.golosTagsList || $stateParams.steemTagsList) {

      ctrl.media = $stateParams.golosTagsList ? 'golos' : 'steem';
      $cookies.put('media', ctrl.media);
      $rootScope.$broadcast('chainSet');

      var alltags = $stateParams.golosTagsList ? $stateParams.golosTagsList : $stateParams.steemTagsList;
      TAGS[ctrl.media] = alltags.split(',').map(function (tag) {
        return ungolosFilter(tag)
      });
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
      document.body.scrollTop = 0;
    });

    $scope.$on('$destroy', function () {
      chainWatcher();
    });
    
    ctrl.modalShown = false;
    ctrl.postLoader = false;
    
    ctrl.closeModal = function () {
      document.getElementsByClassName('post-view__overlay')[0].scrollTop = 0;
      ctrl.modalShown = false;
      $rootScope.modalShown = false;
    }
    
    ctrl.toggleModal = function ($event, post) {
        $event.preventDefault();
        ctrl.postLoader = true;
        ctrl.postView = {};
        loadPostContent(ctrl.media, post.author, post.permlink, function (posts) {        
          post = posts[0];
          post.posted = GetPostsService.convertDate(post.posted);
          ctrl.postView = post;
          ctrl.postView.tags = post.tags.map(function (tag) {
            return golosFilter(tag)
          });
          ctrl.postView.category = golosFilter(post.category);
          loadAccount(ctrl.media, post.author, function (profile) {
            // setting profile data
            ctrl.postView.author_name = profile.name;
            ctrl.postView.author_about = profile.about;
            
            // display post window
            ctrl.modalShown = true;
            ctrl.postLoader = false;
            $rootScope.modalShown = ctrl.modalShown;

            //get replies
            if (post.children) {
              loadPostReplies(ctrl.media, post.author, post.permlink, function (posts) {
                posts = convertReplies(posts);
                ctrl.postView.replies = posts;     
                ctrl.postView.replies_loaded = true;                
                return;
              });
            }
          })

        });
    };

    function convertReplies(posts) {
      posts = posts.map(function (post) {
        post.posted = GetPostsService.convertDate(post.posted);
        if (!post.children) {
          return post;
        }
        post.replies = convertReplies(post.replies);
        return post;
      });
      return posts;
    }

    function loadPostReplies(media, author, permlink, callback) {
      ctrl.postView.replies = false;
      $http.get('/api/' + ctrl.media + '/@' + author + '/' + permlink + '/replies').success(function (response) {
        callback(response);
      });

    }

    function loadPostContent(media, author, permlink, callback) {
      $http.get('/api/' + ctrl.media + '/@' + author + '/' + permlink).success(function (response) {
        callback(response);
      });

    }

    function loadAccount(media, author, callback) {
      $http.get('/api/' + ctrl.media + '/@' + author).success(function (response) {
        callback(response);
      });

    }

    function intTags() {
      ctrl.tags = TAGS[ctrl.media].map(function (tag) {
        return {
          name: tag,
          posts: []
        }
      });

    }

    function loadTrendingTag(n, media, guid, next) {
      return function () {
        ctrl.tags[n].posts_loaded = false;
        $http.get('/api/' + ctrl.media + '/trending/' + TAGS[ctrl.media][n] + '/' + guid).success(function (response) {
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
//      console.log(ctrl.tags);
      $http({
        method: 'delete',
        url: '/api/cache/' + ctrl.guid
      });
    }

    function loadData() {
      intTags();
      ctrl.guid = uuid2.newuuid();
      var fn = [done];
      for (var i = TAGS[ctrl.media].length - 1; i > -1; i--) {
        fn.push(loadRecentTag(i, ctrl.media, function () {
          fn.pop()();
        }));

        fn.push(loadTrendingTag(i, ctrl.media, ctrl.guid, function () {
          fn.pop()();
        }));
      }
      fn.pop()();
    }

  };



}());