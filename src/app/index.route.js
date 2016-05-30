(function() {
  'use strict';

  angular
    .module('digglyFeProto')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/views/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      // Abstract parent state
      .state('explore', {
        url: '/explore/:id',
        templateUrl: 'app/explore/views/layout.html',
        // This is the default child state
        redirectTo: 'explore.visual'
      })
      .state('explore.visual', {
        url: '/visual',
        parent: 'explore',
        templateUrl: 'app/explore/views/visual.html',
        controller: 'VisualController',
        controllerAs: 'visual'
      })
      .state('explore.visual.text', {
        parent: 'explore.visual',
        templateUrl: 'app/explore/views/partials/text.html',
        controller: 'VisualController',
        controllerAs: 'visual'
      })
      .state('explore.visual.visualizer', {
        parent: 'explore.visual',
        templateUrl: 'app/explore/views/partials/visualizer.html',
        controller: 'VisualController',
        controllerAs: 'visual'
      })
      .state('explore.history', {
        parent: 'explore',
        url: '/history',
        templateUrl: 'app/explore/views/history.html',
        controller: 'HistoryController',
        controllerAs: 'history'
      })
      .state('explore.bookmark', {
        parent: 'explore',
        url: '/bookmarks',
        templateUrl: 'app/explore/views/bookmarks.html',
        controller: 'BookmarkController',
        controllerAs: 'bookmarks'
      });

    // For time being
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }

})();
