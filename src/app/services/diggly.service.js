// Adapter for the Diggly Service
(function() {
    'use strict';

    angular
        .module('digglyFeProto')
        .service('DigglyService', DigglyService);

    /** @ngInject */
    function DigglyService(Restangular) {
        var DIGGLY_BASEURL = "http://rack36.cs.drexel.edu:8000/diggly/";
        // Configs
        Restangular.setBaseUrl(DIGGLY_BASEURL);

        // Main route
        var wikiTopics = Restangular.all('topics');

        var a = this.action = {
            /**
            * Get all topics
            * Request: /topics
            *
            * @return {object} Returns a promise of object containing topic data
            */
            getAllTopics: function() {
                return wikiTopics
                    .getList();
            },

            /**
            * Get information on one topic
            * Request: /topics/:topicId
            *
            * @param  {number} topicId Id of Wikipedia Article
            * @return {object}         Returns a promise containing one article data
            */
            getTopic: function(topicId) {
                return Restangular
                        .one('topics', topicId)
                        .get();
            },

            /**
            * Get the relevant topic of an article
            * Request: /topics/explore/:topicId
            *
            * @param  {num} topicId Id of Wikipedia
            * @return {object}         Returns a promise restangular topic
            */
            getRelevantTopics: function(topicId) {
                return wikiTopics.one('explore', topicId)
                    .get();
            }
        };

        return {
            getAllTopics: a.getAllTopics,
            getTopic: a.getTopic,
            getRelevantTopics: a.getRelevantTopics
        };
    }
})();
