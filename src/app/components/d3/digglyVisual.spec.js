(function() {
    'use strict';

    var digglyTemplate = '<div class="visual" style="height: 400px"><diggly-visual data="data"></diggly-visual></div>';
    var mock = [
        {"article_title": "Rodentia", "linked_topics": [{"description": "Rodent is linked to Rodentia", "wiki_link": "https://en.wikipedia.org/wiki/Rodent", "title": "Rodent", "target_id": 19337310, "score": 0.85, "source_id": 26087}], "description": "", "wiki_link": "https://en.wikipedia.org/wiki/Rodentia", "article_id": 26087, "summary": ""}
    ];
    var $compile;
    var $scope;

    describe('Diggly D3 Directive', function() {
        beforeEach(module('digglyFeProto'));

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope = _$rootScope_.new();
            $scope.data = mock;

            compileTemplate(digglyTemplate);
        }));


    });


    // Helper Method
    /**
     * Traverses DOM to compile the template and associated scopes
     * @param  {String} template  optional, template code
     * @return {Object}           Returns an object containing our template and scope
     */

    function compileTemplate(template) {
        var compiledElement;
        var isolatedScope;

        if (!template) {
            // set a default code template here
            template = '</div example></div>';
        }

        compiledElement = $compile(template)($scope);
        isolatedScope = compiledElement.scope();

        $scope.$digest();

        return isolatedScope;
    }
})();
