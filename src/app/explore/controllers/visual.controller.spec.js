(function() {
  'use strict';

  describe('VisualController', function(){
    var vm;
    var $state;
    var $rootScope;
    var $scope;
    var $window;
    var $httpBackend;
    var ExploreService;
    var DigglyService;
    var Restangular;

    var mockCurrent = {
      "article_title": "1810 United States Census",
      "description": "The United States Census of 1810 was the third Census conducted in the United States. It was conducted on August 6, 1810. It showed that 7,239,881 people were living in the United States, of which 1,191,362 were slaves. The 1810 Census included one new state: Ohio. The original census returns for the District of Columbia, Georgia, Mississippi, New Jersey, and Ohio were lost or destroyed over the years. Most of Tennessee's original forms were also lost, other than Grainger and Rutherford counties.",
      "wiki_link": "https://en.wikipedia.org/wiki/1810_United_States_Census",
      "article_id": 4483500,
      "summary": "The United States Census of 1810 was the third Census conducted in the United States."
    };

    beforeEach(module('digglyFeProto'));

    beforeEach(inject(function($controller, _$rootScope_, _$state_, _ExploreService_,
                                   _$window_, _$httpBackend_, _DigglyService_, _Restangular_) {
       $rootScope = _$rootScope_;
       $scope = $rootScope.$new();
       vm = $controller('VisualController', {
          $scope: $scope
       });
       $state = _$state_;
       $window = _$window_;
       $httpBackend = _$httpBackend_;
       ExploreService = _ExploreService_;
       DigglyService = _DigglyService_;
       Restangular = _Restangular_;
    }));

    beforeEach(function() {
      $httpBackend.whenGET('http://localhost:8000/diggly/topics/explore/100').respond(200, mockCurrent);
      // Wrap response
      var restangularWrapResp = Restangular.one('/topics/explore', 100).get();

      $httpBackend.whenGET('app/home/views/home.html').respond(200, '');
      $httpBackend.whenGET('app/explore/views/layout.html').respond(200, '');
      $httpBackend.whenGET('app/explore/views/visual.html').respond(200, '');
      $httpBackend.whenGET('http://localhost:8000/diggly/topics/explore/100').respond(200, restangularWrapResp);

      $window.__history__ = ['testItem', 'testItem2'];
      vm.model.currentTopic = mockCurrent;
    });

    it('should populate model on load', function() {
      spyOn(ExploreService, 'getHistory').and.callThrough();
      vm.action.init();
      expect(ExploreService.getHistory).toHaveBeenCalled();
      expect(vm.model.history).toEqual(['testItem', 'testItem2']);
    });

    it('should add current item to history', function() {
      vm.action.init();
      expect(vm.model.history.length).toBe(2);

      vm.action.updateHistory();
      expect(vm.model.history[0]).toBe(mockCurrent);
    });

    it('should fetch a topic from the backend', function() {
      spyOn(DigglyService, 'getRelevantTopics').and.callThrough();
      vm.action.fetchTopic(100);
      $httpBackend.flush();
      $scope.$digest();

      expect(DigglyService.getRelevantTopics).toHaveBeenCalled();
      expect(vm.model.data).toEqual(mockCurrent);
    });

    it('should redirect and load controller with the new topic', function() {
      spyOn(DigglyService, 'getRelevantTopics').and.callThrough();
      spyOn($state, 'go').and.callThrough();
      vm.action.fetchTopic(100);
      $httpBackend.flush();
      $scope.$digest();

      expect($state.go).toHaveBeenCalled();
    });
  });
})();
