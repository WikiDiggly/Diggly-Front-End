(function() {
  'use strict';

  angular
    .module('digglyFeProto')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $compileProvider ) {
    // Whitelist Blobs
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob):/);

    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
  }

})();
