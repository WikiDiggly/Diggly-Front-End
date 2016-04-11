(function() {
  'use strict';

    angular
        .module('digglyFeProto')
        .controller('BookmarkController', BookmarkController);

    /** @ngInject */
    function BookmarkController(ExploreService, $window) {
        var m = this.model = {
            bookmarks: [],
            exportType: "txt",
            extensions: [
                {
                    label: "Text File (.txt)",
                    type: "txt"
                },
                {
                    label: "Comma-Seperated Values (.csv)",
                    type: "csv"
                }
            ],
            downloadUrl: "",
            fileName: "MyBookmarks"
        };

        var a = this.action = {
            /**
             * Wrapper to remove current item
             * @param  {object} currentItem current history item to be remove
             * @return {void}
             */
            removeItem: function(currentItem) {
                ExploreService.removeBookmarkItem(currentItem);
            },

            /**
             * Wrapper to clear bookmarks
             * @return {void}
             */
            clearBookmarks: function() {
                ExploreService.clearBookmarks();
                m.bookmarks.length = 0;
            },

            /**
             * Trigger when a extension type is set
             * @return {string} returns the URL to invoke a download
             */
            export: function() {
                var bookmarks = a.normalize();
                var parsedJSON;

                switch(m.exportType) {
                    case "csv":
                        // create parsed JSON
                        parsedJSON = _.map(bookmarks, function (article) {
                            var parsedObj =  _.mapValues(article, function(value) {
                                // Iterate through all values and parse with a encoded quote to replaced during CSV
                               return _(value).toString().replace(/\"/g, '%22');
                            });
                            return parsedObj;
                        });
                        var convertedCsv = a.convertoCsv(parsedJSON, "Diggly-CSV", true);
                        m.downloadUrl = a.exportTo("csv", convertedCsv);
                        break;

                    default:
                    case "txt":
                        parsedJSON = _.map(bookmarks, function (article) {
                            var parsedObj =  _.mapValues(article, function(value) {
                                // Iterate through all values, replace all backslash with encoding
                                // to designate new line and replace all intended quotes and commas
                                // with URL encoding
                               return " " + _(value).toString().replace(/\"/g, '%22').replace(/,/g, '%2C') + "%5c";
                            });
                            return parsedObj;
                        });
                        var text = JSON.stringify(parsedJSON);

                        var parseText = text
                                            // Remove quotes and commas from JSON object string
                                            .replace(/"/g, '')
                                            .replace(/,/g, '')
                                            // Reinsert intended quotes and commas
                                            .replace(/\%22/g, '"')
                                            .replace(/%2C/g, ',')
                                            // Create line break and double line break for end of objects
                                            .replace(/\%5c/g, '\n')
                                            .replace(/}/g, '\n\n')
                                            // Strip out the unneeded JSON-specific characters
                                            .replace(/{/g, '')
                                            .replace(/\[/g, '')
                                            .replace(/\]/g, '');

                        m.downloadUrl = a.exportTo("txt", parseText);
                        break;
                }
            },

            /**
             * Normalize bookmark collection to readable columns
             * @return {array} array of normalized bookmarks
             */
            normalize: function () {
                var normalizedBookmarks = _.map($window.__bookmarks__, function (article) {
                    var tempObj = {
                        "Wikipedia ID": article.article_id,
                        "Wikipedia Title": article.article_title,
                        "Wikipedia Link": article.wiki_link,
                        "Description": article.description,
                        "Short Summary": article.summary
                    };

                    return tempObj;
                });

                return normalizedBookmarks;
            },

            /**
             * Exports a Text file by creating a text blob
             * @param  {string} text The string in the text file
             * @return {url}      the url to the text file created
             */
            exportTo: function (type, data) {
                var blob;

                switch (type) {
                    case "txt":
                        blob = new Blob([data], {type: 'text/plain'});
                        break;

                    case "csv":
                        blob = new Blob([data], {type: 'text/csv'});
                        break;
                }

                if (fileUrl !== null) {
                    $window.URL.revokeObjectURL(data);
                }

                var fileUrl = $window.URL.createObjectURL(blob);

                // returns a URL you can use as a href
                return fileUrl;
            },

            /**
             * Modified function to convert CSV and escapes properly
             * REF0: http://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
             * @param  {object} JSONData    JSON object
             * @param  {bool} ShowLabel   Display column heading
             * @return {string}             a CSV of the JSON object
             */
            convertoCsv: function (JSONData, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
                var CSV = '';
                var row = "";
                var index;

                //This condition will generate the Label/Header
                if (ShowLabel) {
                    row = "";

                    //This loop will extract the label from 1st index of on array
                    for (index in arrData[0]) {
                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }
                    row = row.slice(0, -1);
                    //append Label row with line break
                    CSV += row + '\r\n';
                }

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    row = "";
                    // 2nd loop will extract each column and convert it in string comma-seprated
                    // Need to add quotes to prevent being seperated by content commas.
                    for (index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }
                    row.slice(0, row.length - 1);
                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                CSV.replace(/\%22/g, '"');

                if (CSV === '') {
                    return "Error with exporting";
                }

                return CSV;
            },

            init: function() {
                m.bookmarks = ExploreService.getBookmarks() || '';
                a.export();
            }
        };

        a.init();
    }
})();
