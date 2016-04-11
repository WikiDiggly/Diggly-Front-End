(function() {
    'use strict';

    angular
        .module('digglyFeProto')
        .factory('ExploreService', ExploreService);

    /** @ngInject */
    function ExploreService ($window, $rootScope) {
        var actions = {
            /**
             * Clears history in window object
             * @return {void}
             */
            clearHistory: function () {
                var arrayLen = $window.__history__.length;
                $window.__history__ = _.drop($window.__history__, arrayLen);
                $rootScope.$emit("notify:service", "History cleared.", true);
            },
            /**
             * Clear bookmarks in window object
             * @return {void}
             */
            clearBookmarks: function () {
                var arrayLen = $window.__bookmarks__.length;
                $window.__bookmarks__ = _.drop($window.__history__, arrayLen);
                $rootScope.$emit("notify:service", "Bookmarks cleared.", true);
            },
            /**
             * Removes a bookmark item from the bookmark list
             * @param  {object} item Article Object
             * @return {void}
             */
            removeHistoryItem: function (item) {
                _.remove($window.__history__, function(currentHistory) {
                    return currentHistory.article_id === item.article_id;
                });
            },
            // TODO: Can abstract this into one function to take two params like such:
            // remove(bookmark or history, item);
            /**
             * Removes a bookmark item from the bookmark list
             * @param  {object} item Article Object
             * @return {void}
             */
            removeBookmarkItem: function (item) {
                _.remove($window.__bookmarks__, function(currentBookmark) {
                    return currentBookmark.article_id === item.article_id;
                });
            },
            /**
             * Adds bookmark to bookmark array
             * @param {object} item item to be bookmarked
             */
            addBookmark: function(item) {
                var check = function (currentBookmark) {
                    return currentBookmark.article_id === item.article_id;
                };

                var bookmarks = $window.__bookmarks__;

                // If it's empty or unique ==> Push
                if (bookmarks.length === 0 || _.findIndex(bookmarks, check) === -1) {
                    $rootScope.$emit("notify:service", item.article_title + " has been added to your bookmarks.", false);
                    $window.__bookmarks__.push(item);
                } else {
                    $rootScope.$emit("notify:service", item.article_title + " already exists in your bookmarks.", true);
                }
            },

            /**
             * Returns the history in windows object
             * @return {array} array of history items
             */
            getHistory: function () {
                if (!$window.__history__) {
                    $window.__history__ = [];
                }
                return $window.__history__;
            },

            /**
             * Return the bookmarks in windows object
             * @return {array} array of bookmark items
             */
            getBookmarks: function () {
                if (!$window.__bookmarks__) {
                    $window.__bookmarks__ = [];
                }
                return $window.__bookmarks__;
            }
        };

        return {
            clearHistory: actions.clearHistory,
            clearBookmarks: actions.clearBookmarks,
            removeHistoryItem: actions.removeHistoryItem,
            removeBookmarkItem: actions.removeBookmarkItem,
            getHistory: actions.getHistory,
            addBookmark: actions.addBookmark,
            getBookmarks: actions.getBookmarks
        };
    }

})();
