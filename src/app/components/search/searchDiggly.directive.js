(function() {
    'use strict';
    /* global $ */

    angular
        .module('digglyFeProto')
        .directive('searchDiggly', searchDiggly);

    /** @ngInject */
    function searchDiggly (SearchService, $state, $log) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/search/search.html',
            controller: function () {
                var directTo = function(topic) {
                    SearchService.getId(topic)
                        .then(function(response) {
                            $state.go('explore', {
                                id: response.pageid
                            });
                        })
                        .catch(function(error) {
                            $log.error(error);
                            $log.error("~~~~ Error: The id was not returned ~~~~");
                        });
                };

                $('body').on('search', function (event) {
                    directTo(event.searchString);
                });
            },
            link: function(scope) {
                var debounceTimeout = 200;  // Global timeout for debouce.
                var searchText = "";        // Search string the user typed
                var keyupCounter = 0;       // Counter to set debounce timeout

                var selectedSearchResult;   // Final list element that is selected from the search results
                var selectedSearchString = "";          // The topic that is finally selected

                $('body').on('keyup', '.searchBar', $.debounce(function(event) {
                    var keyPressed = event.keyCode;
                    if (keyPressed !== 37 && keyPressed !== 38 && keyPressed !== 39 && keyPressed !== 40 && keyPressed !== 13) {
                        keyupCounter = keyupCounter + 1;
                        if (keyupCounter%2 !== 0) {
                            debounceTimeout = 0;
                        } else {
                            debounceTimeout = 200;
                        }

                        $('.results').removeClass('active');

                        searchText = $('.searchBar').val();

                        if (searchText !== "") {
                            var searchTextForQuery = searchText.replace(' ', '+');
                            /* Getting search result for the current search string in the search bar */
                            SearchService.getSearchSuggest(searchTextForQuery)
                                .then(function(response) {
                                    // Cleans restangular wrapper
                                    response = response.plain(response);

                                    // Cleans out the empty returned responses
                                    scope.topics = _.filter(response, function(article) {
                                                        return !_.isEmpty(article);
                                                    });

                                    $('.results').addClass('active');
                                })
                                .catch(function(error) {
                                    $log.error(error);
                                    $log.error('Error in AJAX Request.');
                                });
                        }
                    }
                }, debounceTimeout));

                $('body').on('keydown', '.searchBar', function(event) {
                    var keyPressed = event.keyCode;
                    if (keyPressed === 37 || keyPressed === 38 || keyPressed === 39 || keyPressed === 40) {
                        var numResults = $('.results li').length;
                        var selectedIndex = $('.results li').index($('.selected'));

                        if (keyPressed === 40) {     /* If _DOWN_ key is pressed */
                            if (selectedIndex < 0) {
                                $('.results li').eq(0).addClass('selected');    // Select the new element
                                selectedIndex = 0;
                                selectedSearchResult = $('.results .selected');
                            } else {
                                $('.results li').eq(selectedIndex).removeClass('selected');     // Remove Selection from previously selected element
                                $('.results li').eq((selectedIndex + 1)%numResults).addClass('selected');   // Select the new element
                                selectedIndex = (selectedIndex + 1)%numResults;
                                selectedSearchResult = $('.results .selected');
                            }
                        } else if (keyPressed === 38) {  /* If _UP_ key is pressed */
                            if (selectedIndex === -1) {
                                $('.results li').eq(numResults - 1).addClass('selected');   // Select the new element
                                selectedIndex = numResults - 1;
                                selectedSearchResult = $('.results .selected');
                            } else {
                                $('.results li').eq(selectedIndex).removeClass('selected');     // Remove Selection from previously selected element

                                if (selectedIndex < 1) {
                                    $('.results li').eq( ( numResults - (Math.abs(selectedIndex-1) ) % numResults)).addClass('selected');   // Select the new element
                                    selectedIndex = numResults - (Math.abs(selectedIndex-1) % numResults);
                                } else {
                                    $('.results li').eq( (selectedIndex - 1) ).addClass('selected');    // Select the new element
                                    selectedIndex = selectedIndex - 1;
                                }
                                selectedSearchResult = $('.results .selected');
                            }
                        }
                    } else if (keyPressed === 13) {
                        selectedSearchString = $('.results .selected').text();
                        $('.searchBar').val(selectedSearchString);
                        $('.results').removeClass('active');

                        /* Creating search event */
                        var searchEvent = $.Event("search");
                        searchEvent.searchString = selectedSearchString;    // Adding key searchString to search event
                        $('body').trigger(searchEvent);
                    }
                });

                $('body').on('click', '.results li', function() {
                    selectedSearchString = $(this).text();
                    $('.searchBar').val(selectedSearchString);
                    $('.results').removeClass('active');

                    /* Creating search event */
                    var searchEvent = $.Event("search");
                    searchEvent.searchString = selectedSearchString;    // Adding key searchString to search event
                    $('body').trigger(searchEvent);
                });
            }
        };

        return directive;
    }
})();
