(function () {
  'use strict';

  angular.module('oneplace')
    .controller('AppController', AppController);

  AppController.$inject = ['$translate', '$cookies', '$stateParams', 'TAGS', '$rootScope'];

  function AppController($translate, $cookies, $stateParams, TAGS, $rootScope) {
    var app = this;

    app.link = {
      golos: "https://golos.io",
      steem: "https://steemit.com"
    }

    app.setLanguage = $translate.use;
    app.getLanguage = $translate.use;

    app.media = $cookies.get('media') ? 'golos' : 'golos';

    $rootScope.$on('chainSwitch', function (event, data) {
      app.media = ($cookies.get('media'));
    });

    app.setMedia = function (media) {
      app.media = media;
      $cookies.put('media', media);
      $rootScope.$broadcast('chainSwitch');
    }

  }

}());