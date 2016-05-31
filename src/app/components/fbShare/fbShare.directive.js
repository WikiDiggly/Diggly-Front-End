(function() {
  'use strict';

  angular
    .module('digglyFeProto')
    .directive('fbShare', fbShare);

  /** @ngInject */
  function fbShare() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/fbShare/metaTemplate.html',
      scope: {},
      controller: fbShareController,
      controllerAs: 'fbShare',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function fbShareController($rootScope, $location) {
      var vm = this;

      vm.type = 'website';

      $rootScope.$on('visual:update', function(event, data) {
          vm.title = data.article_title;
          vm.url = $location.absUrl();
          vm.description = data.summary;
      });
    }
  }

})();
