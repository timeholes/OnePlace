(function () {
  'use strict';

  var translations_en = {
    BLOCKCHAIN: 'Active blockchain:',
    CHOOSE_LANG: 'Choose interface language:',
    BY: 'by ',
    D1: 'yesterday',
    D2: ' days ago',
    D3: ' days ago',
    D4: ' days ago',
    H1: ' hour ago',
    H2: ' hours ago',
    H3: ' hours ago',
    H4: ' hours ago',
    M1: ' minute ago',
    M2: ' minutes ago',
    M3: ' minutes ago',
    M4: ' minutes ago',
    C1: ' comment',
    C2: ' comments',
    C3: ' comments',
    C4: ' comments',
    RECENT_POSTS: 'Recent posts',
    NO_POSTS: 'No posts in this category.',
    NSFW: 'Image is hidden',
    COPYRIGHT: 'Created by ',
    LICENSE: 'All code is open-source under the MIT license.'
  };

  var translations_ru = {
    BLOCKCHAIN: 'Активный блокчейн:',
    CHOOSE_LANG: 'Изменить язык интерфейса:',
    D1: 'вчера',
    D2: ' день назад',
    D3: ' дня назад',
    D4: ' дней назад',
    H1: ' час назад',
    H2: ' час назад',
    H3: ' часа назад',
    H4: ' часов назад',
    M1: ' минуту назад',
    M2: ' минуту назад',
    M3: ' минуты назад',
    M4: ' минут назад',
    BY: '',
    C1: ' ответ',
    C2: ' ответ',
    C3: ' ответа',
    C4: ' ответов',
    RECENT_POSTS: 'Последние записи',
    NO_POSTS: 'Нет записей в этой категории.',
    NSFW: 'Изображение скрыто',
    COPYRIGHT: 'Создано ',
    LICENSE: 'Код распространяется по лицензии MIT.'
  };

  angular.module('oneplace', ['ui.router', 'pascalprecht.translate', 'ngCookies', 'ngSanitize'])
    .constant("TAGS", {
      steem: ["steemit", "life", "photography", "art", "bitcoin", "travel", "story", "money", "introduceyourself", "food", "blockchain",
              "news", "philosophy", "science", "health", "funny", "nature", "politics", "music", "video"],
      golos: ["ru--golos", "ru--zhiznx", "ru--fotografiya", "ru--iskusstvo", "ru--tvorchestvo", "ru--obrazovanie",
              "ru--blokcheijn", "ru--statistika", "ru--stikhi", "ru--otkrytyij-kod", "ru--znakomstvo", "ru--yekonomika",
              "ru--konkurs", "ru--puteshestviya", "ru--istoriya", "ru--programmirovanie", "ru--priklyucheniya", "ru--mysli",
              "ru--priroda", "ru--nauka"]
    })
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider', '$translateProvider'];

  function config($urlRouterProvider, $stateProvider, $translateProvider, $routeProvider) {

    // Routing config

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html'
      })

    .state('golostags', {
      url: '/golos/{golosTagsList}',
      templateUrl: 'templates/home.html'
    })

    .state('steemtags', {
      url: '/steem/{steemTagsList}',
      templateUrl: 'templates/home.html'
    });

    // Translations

    $translateProvider.translations('en', translations_en);
    $translateProvider.translations('ru', translations_ru);
    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('sanitize');
  }

})();
