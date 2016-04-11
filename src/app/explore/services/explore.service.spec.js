(function() {
  'use strict';

  var mockHistory = [
    {
      "article_title": "1820 United States Census",
      "description": "The United States Census of 1820 was the fourth Census conducted in the United States. It was conducted on August 7, 1820. The 1820 Census included six new states: Louisiana, Indiana, Mississippi, Illinois, Alabama and Maine. There has been a district wide loss of 1820 Census records for Arkansas Territory, Missouri Territory and New Jersey, however. The total population was determined to be 9,638,453, of which 1,538,022 were slaves. The center of population was about 120 miles (193 km) west-northwest of Washington in Hardy County, Virginia (now in West Virginia).",
      "wiki_link": "https://en.wikipedia.org/wiki/1820_United_States_Census",
      "article_id": 4483507,
      "summary": "The United States Census of 1820 was the fourth Census conducted in the United States.",
      "$$hashKey": "object:31"
    },
    {
      "article_title": "1810 United States Census",
      "description": "The United States Census of 1810 was the third Census conducted in the United States. It was conducted on August 6, 1810. It showed that 7,239,881 people were living in the United States, of which 1,191,362 were slaves. The 1810 Census included one new state: Ohio. The original census returns for the District of Columbia, Georgia, Mississippi, New Jersey, and Ohio were lost or destroyed over the years. Most of Tennessee's original forms were also lost, other than Grainger and Rutherford counties.",
      "wiki_link": "https://en.wikipedia.org/wiki/1810_United_States_Census",
      "article_id": 4483500,
      "summary": "The United States Census of 1810 was the third Census conducted in the United States.",
      "$$hashKey": "object:28"
    },
    {
      "article_title": "2000 United States Census",
      "description": "The Twenty-second United States Census, known as Census 2000 and conducted by the Census Bureau, determined the resident population of the United States on April 1, 2000, to be 281,421,906, an increase of 13.2% over the 248,709,873 people enumerated during the 1990 Census. This was the twenty-second federal census and was at the time the largest civilly administered peacetime effort in the United States. Approximately 16 percent of households received a \"long form\" of the 2000 census, which contained over 100 questions. Full documentation on the 2000 census, including census forms and a procedural history, is available from the Integrated Public Use Microdata Series. == Data availability ==\nMicrodata from the 2000 census is freely available through the Integrated Public Use Microdata Series. Aggregate data for small areas, together with electronic boundary files, can be downloaded from the National Historical Geographic Information System.",
      "wiki_link": "https://en.wikipedia.org/wiki/2000_United_States_Census",
      "article_id": 432383,
      "summary": "The Twenty-second United States Census, known as Census 2000 and conducted by the Census Bureau, determined the resident population of the United States on April 1, 2000, to be 281,421,906, an increase of 13.2% over the 248,709,873 people enumerated during the 1990 Census.",
      "$$hashKey": "object:25"
    },
    {
      "article_title": "Flint Hill, Missouri",
      "description": "Flint Hill is a city in St. Charles County, Missouri, United States. The population was 525 at the 2010 census. == Geography ==\nFlint Hill is located at 38°51′34″N 90°51′52″W (38.859466, -90.864454). According to the United States Census Bureau, the city has a total area of 2.47 square miles (6.40 km2), all of it land. == Demographics ==\n\n\n=== 2010 census ===\nAs of the census of 2010, there were 525 people, 179 households, and 150 families residing in the city. The population density was 212.6 inhabitants per square mile (82.1/km2).",
      "wiki_link": "https://en.wikipedia.org/wiki/Flint_Hill,_Missouri",
      "article_id": 123131,
      "summary": "Flint Hill is a city in St. Charles County, Missouri, United States.",
      "$$hashKey": "object:20"
    }
  ];

  describe('ExploreServices', function(){
    var ExploreService;
    var $window;

    beforeEach(module('digglyFeProto'));

    beforeEach(inject(function(_ExploreService_, _$window_) {
       ExploreService = _ExploreService_;
       $window = _$window_;
    }));

    beforeEach(function() {
      $window.__history__ = mockHistory;
    });

    it('should clear all history', function() {
      expect($window.__history__.length).toBe(4);
      ExploreService.clearHistory();
      expect($window.__history__.length).toBe(0);
    });

    it('should remove a bookmark item', function() {
      var RemovedItem = mockHistory[1];

      ExploreService.removeHistoryItem(RemovedItem);
      expect($window.__history__.length).toBe(3);

      var removeTrue = _.findIndex($window.__history__, function(historyItem) {
                          return historyItem === RemovedItem;
                        });

      expect(removeTrue).toBe(-1);
    });

    it('should return the history', function() {
      var expectedHistory = ExploreService.getHistory();

      expect(expectedHistory).toEqual(mockHistory);
    });
  });
})();
