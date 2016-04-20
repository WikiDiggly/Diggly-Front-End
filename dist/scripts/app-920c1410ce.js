/* jshint ignore:start */
!function(e){e.extend({debounce:function(e,t,r,i){3==arguments.length&&"boolean"!=typeof r&&(i=r,r=!1);var a;return function(){var o=arguments;i=i||this,r&&!a&&e.apply(i,o),clearTimeout(a),a=setTimeout(function(){!r&&e.apply(i,o),a=null},t)}},throttle:function(e,t,r){var i,a,o;return function(){a=arguments,o=!0,r=r||this,i||!function(){o?(e.apply(r,a),o=!1,i=setTimeout(arguments.callee,t)):i=null}()}}})}(jQuery),$(document).ready(function(e){var t=!(void 0===Cookies.get("diggly-session")),r={};e("body").on("visual:clicked-node",function(i,a){var o=a.nodeID,n=a.centralNodeID;t&&void 0!==Cookies.get("diggly-session")||(r={},Cookies.set("diggly-session",r,{expires:1})),t=!0,r=JSON.parse(Cookies.get("diggly-session")),r[o]?console.log("No request sent for clicked node as it has already been visited today."):(e.ajax({url:"http://rack36.cs.drexel.edu:8000/diggly/topics/track/",type:"POST",data:"tid_src="+n+"&tid_dst="+o,async:!1,error:function(e){console.log("Error happened in AJAX Request!!"),console.log(e)}}),r[o]=!0,Cookies.remove("diggly-session"),Cookies.set("diggly-session",r,{expires:1}))})}),function(){"use strict";angular.module("digglyFeProto",["ngAnimate","d3","ngCookies","ngSanitize","restangular","ui.router","mm.foundation","ngCsv"])}(),function(){"use strict";function e(e,t,r){var i={restrict:"E",templateUrl:"app/components/search/search.html",controller:function(){var i=function(i){e.getId(i).then(function(e){t.go("explore",{id:e.pageid})})["catch"](function(e){r.error(e),r.error("~~~~ Error: The id was not returned ~~~~")})};$("body").on("search",function(e){i(e.searchString)})},link:function(t){var i,a=200,o="",n=0,s="";$("body").on("keyup",".searchBar",$.debounce(function(i){var s=i.keyCode;if(37!==s&&38!==s&&39!==s&&40!==s&&13!==s&&(n+=1,a=n%2!==0?0:200,$(".results").removeClass("active"),o=$(".searchBar").val(),""!==o)){var l=o.replace(" ","+");e.getSearchSuggest(l).then(function(e){e=e.plain(e),t.topics=_.filter(e,function(e){return!_.isEmpty(e)}),$(".results").addClass("active")})["catch"](function(e){r.error(e),r.error("Error in AJAX Request.")})}},a)),$("body").on("keydown",".searchBar",function(e){var t=e.keyCode;if(37===t||38===t||39===t||40===t){var r=$(".results li").length,a=$(".results li").index($(".selected"));40===t?0>a?($(".results li").eq(0).addClass("selected"),a=0,i=$(".results .selected")):($(".results li").eq(a).removeClass("selected"),$(".results li").eq((a+1)%r).addClass("selected"),a=(a+1)%r,i=$(".results .selected")):38===t&&(-1===a?($(".results li").eq(r-1).addClass("selected"),a=r-1,i=$(".results .selected")):($(".results li").eq(a).removeClass("selected"),1>a?($(".results li").eq(r-Math.abs(a-1)%r).addClass("selected"),a=r-Math.abs(a-1)%r):($(".results li").eq(a-1).addClass("selected"),a-=1),i=$(".results .selected")))}else if(13===t){s=$(".results .selected").text(),$(".searchBar").val(s),$(".results").removeClass("active");var o=$.Event("search");o.searchString=s,$("body").trigger(o)}}),$("body").on("click",".results li",function(){s=$(this).text(),$(".searchBar").val(s),$(".results").removeClass("active");var e=$.Event("search");e.searchString=s,$("body").trigger(e)})}};return i}e.$inject=["SearchService","$state","$log"],angular.module("digglyFeProto").directive("searchDiggly",e)}(),function(){"use strict";function e(e){var t=this.action={getSearchSuggest:function(t){return e.oneUrl("suggest","http://rack36.cs.drexel.edu/suggest").get({q:t})},getId:function(t){return e.oneUrl("pageid","http://rack36.cs.drexel.edu/getpageid").get({q:t})}};return{getSearchSuggest:t.getSearchSuggest,getId:t.getId}}e.$inject=["Restangular"],angular.module("digglyFeProto").service("SearchService",e)}(),function(){"use strict";function e(e,t){var r={restrict:"EA",scope:{},link:function(r){r.state=!1,t.$on("notify:service",function(t,i,a){r.message=i,r.state=!0,r.exists=a?!0:!1,e(function(){r.state=!1},2500)})},template:'<div class="notify__message" ng-class="{show: state, error: exists}"><p ng-bind="message"></p></div>'};return r}e.$inject=["$timeout","$rootScope"],angular.module("digglyFeProto").directive("notifyService",e)}(),function(){"use strict";function e(){function e(e){var t=this;t.relativeDate=e(t.creationDate).fromNow()}e.$inject=["moment"];var t={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:e,controllerAs:"vm",bindToController:!0};return t}angular.module("digglyFeProto").directive("acmeNavbar",e)}(),function(){"use strict";function e(e){function t(e,t){var r=this;r.type="website",e.$on("visual:update",function(e,i){console.log(i),r.title=i.article_title,r.url=t.absUrl(),r.description=i.summary})}t.$inject=["$rootScope","$location"];var r={restrict:"E",templateUrl:"app/components/fbshare/metaTemplate.html",scope:{},controller:t,controllerAs:"fbShare",bindToController:!0};return r}e.$inject=["$rootScope"],angular.module("digglyFeProto").directive("fbShare",e)}(),function(){"use strict";function e(e,t){var r={restrict:"EA",scope:{data:"=",onClick:"&"},link:function(r,i){var n=r.model={d3Data:{nodes:"",edges:""}};e.d3().then(function(e){var s=e.select(i[0]).append("svg").style("width","100%").style("height","100%");t.onresize=function(){r.$apply()},r.$watch(function(){return angular.element(t)[0].innerWidth},function(){angular.element(t)[0].innerWidth<1024&&r.updateDim()}),r.$watch("data",function(e,t){t!==e&&r.render(e)},!1);var l=$(".visualizer").height(),c=$(".visualizer").width(),d=Math.round(c/4);r.updateDim=_.debounce(function(){c=$(".visualizer").width(),l=$(".visualizer").height(),d=Math.round(c/4),r.render(r.data)},300),r.render=function(t){if(s.selectAll("*").remove(),t){n.d3Data.nodes=a(t),n.d3Data.edges=o(t.linked_topics.length);var i=e.scale.category10(),u=e.layout.force().nodes(n.d3Data.nodes).links(n.d3Data.edges).size([c,l]).linkDistance(d).charge([-500]).theta(.1).gravity(.05).on("tick",h).start(),m=s.selectAll("line").data(n.d3Data.edges).enter().append("line").attr("id",function(e,t){return"edge"+t}).attr("marker-end","url(#marker_circle)").style("stroke","#ccc").style("pointer-events","none"),p=s.selectAll("circle").data(n.d3Data.nodes).enter().append("circle").attr({r:function(e){return 40*e.score},"class":function(e,t){return"node-"+t}}).style("fill",function(e,t){return i(t)}).call(u.drag).on("click",function(e,t){if(0!==t){var i=e.target_id;r.onClick({item:i})}}),v=s.selectAll(".nodelabel").data(n.d3Data.nodes).enter().append("text").attr({x:function(e){return e.x},y:function(e){return e.y},"class":function(e,t){return"label-"+t},stroke:"black"}).on("click",function(e,t){if(0!==t){var i=e.target_id;r.onClick({item:i})}}).text(function(e){return e.title}),g=s.selectAll(".edgepath").data(n.d3Data.edges).enter().append("path").attr({d:function(e){return"M "+e.source.x+" "+e.source.y+" L "+e.target.x+" "+e.target.y},"class":"edgepath","fill-opacity":0,"stroke-opacity":0,fill:"blue",stroke:"red",id:function(e,t){return"edgePath-"+t}}).style("pointer-events","none"),f=s.selectAll(".edgelabel").data(n.d3Data.edges).enter().append("text").style("pointer-events","none").attr({"class":"edgelabel",id:function(e,t){return"edgelabel-"+t},dx:80,dy:0,"font-size":10,fill:"#aaa"});f.append("textPath").attr("xlink:href",function(e,t){return"#edgepath"+t}).style("pointer-events","none"),s.append("defs").append("marker").attr({id:"arrowhead",viewBox:"-0 -5 10 10",refX:25,refY:0,orient:"auto",markerWidth:10,markerHeight:10,xoverflow:"visible"}).append("svg:path").attr("d","M 0,-5 L 10 ,0 L 0,5").attr("fill","#ccc").attr("stroke","#ccc");var h=function(){m.attr({x1:function(e){return e.source.x},y1:function(e){return e.source.y},x2:function(e){return e.target.x},y2:function(e){return e.target.y}}),p.attr({cx:function(e){return e.x},cy:function(e){return e.y}}),v.attr("x",function(e){return e.x}).attr("y",function(e){return e.y}),g.attr("d",function(e){var t="M "+e.source.x+" "+e.source.y+" L "+e.target.x+" "+e.target.y;return t})};u.on("tick",h)}}})}},i=function(e){var t={};return t=_.omit(e,["linked_topics"]),t.title=t.article_title,t.score=1,[t]},a=function(e){var t=_.union(i(e),e.linked_topics);return t},o=function(e){var t=_.times(e,function(e){return{source:e+1,target:0}});return t};return r}e.$inject=["d3Service","$window"],angular.module("digglyFeProto").directive("digglyVisual",e)}(),function(){"use strict";angular.module("d3",[])}(),function(){"use strict";function e(e,t,r){function i(){r.$apply(function(){a.resolve(window.d3)})}var a=t.defer(),o=e[0].createElement("script");o.type="text/javascript",o.async=!0,o.src="http://d3js.org/d3.v3.min.js",o.onreadystatechange=function(){"complete"===this.readyState&&i()},o.onload=i;var n=e[0].getElementsByTagName("body")[0];return n.appendChild(o),{d3:function(){return a.promise}}}e.$inject=["$document","$q","$rootScope"],angular.module("d3").factory("d3Service",e)}(),function(){"use strict";function e(e){var t={history:[],bookmarks:[]},r={clearHistory:function(){var r=t.history.length;t.history=_.drop(t.history,r),e.$emit("notify:service","History cleared.",!0)},clearBookmarks:function(){var r=t.bookmarks.length;t.bookmarks=_.drop(t.history,r),e.$emit("notify:service","Bookmarks cleared.",!0)},removeHistoryItem:function(e){_.remove(t.history,function(t){return t.article_id===e.article_id})},removeBookmarkItem:function(e){_.remove(t.bookmarks,function(t){return t.article_id===e.article_id})},addBookmark:function(r){var i=function(e){return e.article_id===r.article_id},a=t.bookmarks;0===a.length||-1===_.findIndex(a,i)?(e.$emit("notify:service",r.article_title+" has been added to your bookmarks.",!1),t.bookmarks.push(r)):e.$emit("notify:service",r.article_title+" already exists in your bookmarks.",!0)},setHistory:function(e){if(t.history.length>0){var r=_.findIndex(t.history,function(t){return t.article_id===e.article_id});-1===r&&t.history.unshift(e)}else t.history.push(e)},getHistory:function(){return t.history||(t.history=[]),t.history},getBookmarks:function(){return t.bookmarks||(t.bookmarks=[]),t.bookmarks}};return{clearHistory:r.clearHistory,clearBookmarks:r.clearBookmarks,removeHistoryItem:r.removeHistoryItem,removeBookmarkItem:r.removeBookmarkItem,setHistory:r.setHistory,getHistory:r.getHistory,addBookmark:r.addBookmark,getBookmarks:r.getBookmarks}}e.$inject=["$rootScope"],angular.module("digglyFeProto").factory("ExploreService",e)}(),function(){"use strict";function e(e,t,r,i,a){var o=this.model={history:[],currentTopic:"",data:""};i.loading=!1;var n=this.action={updateHistory:function(e){t.setHistory(e),o.history=t.getHistory()},fetchTopic:function(t){i.loading=!0,e.getRelevantTopics(t).then(function(e){o.data=e.plain(e),o.currentTopic=_.omit(o.data,"linked_topics"),r.go("explore.visual",{id:t},{location:!0,notify:!1,reload:!1}),i.loading=!1})["finally"](function(){n.updateHistory(o.currentTopic),a.$emit("visual:update",o.currentTopic)})},addBookmark:function(e){t.addBookmark(e)},clearHistory:function(){t.clearHistory(),o.history.length=0},onClick:function(e){n.fetchTopic(e);var t={centralNodeID:o.currentTopic.article_id,nodeID:e};$("body").trigger("visual:clicked-node",t)},init:function(){r.params.id&&n.fetchTopic(r.params.id),o.history=t.getHistory()||[]}};n.init()}e.$inject=["DigglyService","ExploreService","$state","$scope","$rootScope"],angular.module("digglyFeProto").controller("VisualController",e)}(),function(){"use strict";function e(e){var t=this.model={history:[]},r=this.action={removeItem:function(t){e.removeHistoryItem(t)},clearHistory:function(){e.clearHistory(),t.history.length=0},init:function(){t.history=e.getHistory()||""}};r.init()}e.$inject=["ExploreService"],angular.module("digglyFeProto").controller("HistoryController",e)}(),function(){"use strict";function e(e,t){var r=this.model={bookmarks:[],exportType:"txt",extensions:[{label:"Text File (.txt)",type:"txt"},{label:"Comma-Seperated Values (.csv)",type:"csv"}],downloadUrl:"",fileName:"MyBookmarks",summary:!0,longDesc:!0,wikiUrl:!0},i=this.action={removeItem:function(t){e.removeBookmarkItem(t),r.bookmarks=e.getBookmarks(),i["export"]()},clearBookmarks:function(){e.clearBookmarks(),r.bookmarks=e.getBookmarks(),i["export"]()},"export":function(){var e,t=i.normalize();switch(r.exportType){case"csv":e=_.map(t,function(e){var t=_.mapValues(e,function(e){return _(e).toString().replace(/\"/g,"%22")});return t});var a=i.convertoCsv(e,"Diggly-CSV",!0);r.downloadUrl=i.exportTo("csv",a);break;default:case"txt":e=_.map(t,function(e){var t=_.mapValues(e,function(e){return" "+_(e).toString().replace(/\"/g,"%22").replace(/,/g,"%2C")+"%5c"});return t});var o=JSON.stringify(e),n=o.replace(/"/g,"").replace(/,/g,"").replace(/\%22/g,'"').replace(/%2C/g,",").replace(/\%5c/g,"\n").replace(/}/g,"\n\n").replace(/{/g,"").replace(/\[/g,"").replace(/\]/g,"");r.downloadUrl=i.exportTo("txt",n)}},normalize:function(){r.bookmarks=e.getBookmarks();var t=_.map(r.bookmarks,function(e){var t={"Wikipedia ID":e.article_id,"Wikipedia Title":e.article_title};return r.wikiUrl&&(t["Wikipedia Link"]=e.wiki_link),r.summary&&(t.Summary=e.summary),r.longDesc&&(t.Description=e.description),t});return t},exportTo:function(e,r){var i;switch(e){case"txt":i=new Blob([r],{type:"text/plain"});break;case"csv":i=new Blob([r],{type:"text/csv"})}null!==a&&t.URL.revokeObjectURL(r);var a=t.URL.createObjectURL(i);return a},convertoCsv:function(e,t){var r,i="object"!=typeof e?JSON.parse(e):e,a="",o="";if(t){o="";for(r in i[0])o+=r+",";o=o.slice(0,-1),a+=o+"\r\n"}for(var n=0;n<i.length;n++){o="";for(r in i[n])o+='"'+i[n][r]+'",';o.slice(0,o.length-1),a+=o+"\r\n"}return a.replace(/\%22/g,'"'),""===a?"Error with exporting":a},init:function(){r.bookmarks=e.getBookmarks()||"",i["export"]()}};i.init()}e.$inject=["ExploreService","$window"],angular.module("digglyFeProto").controller("BookmarkController",e)}(),function(){"use strict";function e(e){var t="http://rack36.cs.drexel.edu:8000/diggly/";e.setBaseUrl(t);var r=e.all("topics"),i=this.action={getAllTopics:function(){return r.getList()},getTopic:function(t){return e.one("topics",t).get()},getRelevantTopics:function(e){return r.one("explore",e).get()}};return{getAllTopics:i.getAllTopics,getTopic:i.getTopic,getRelevantTopics:i.getRelevantTopics}}e.$inject=["Restangular"],angular.module("digglyFeProto").service("DigglyService",e)}(),function(){"use strict";function e(e){e.debug("Diggly is up and running, at your service!")}function t(e,t){e.$on("$stateChangeStart",function(e,r,i){r.redirectTo&&(e.preventDefault(),t.go(r.redirectTo,i))})}e.$inject=["$log"],t.$inject=["$rootScope","$state"],angular.module("digglyFeProto").run(e).run(t)}(),function(){"use strict";function e(e,t,r){e.state("home",{url:"/",templateUrl:"app/home/views/home.html"}).state("explore",{url:"/explore/:id",templateUrl:"app/explore/views/layout.html",redirectTo:"explore.visual"}).state("explore.visual",{url:"/visual",parent:"explore",templateUrl:"app/explore/views/visual.html",controller:"VisualController",controllerAs:"visual"}).state("explore.history",{parent:"explore",url:"/history",templateUrl:"app/explore/views/history.html",controller:"HistoryController",controllerAs:"history"}).state("explore.bookmark",{parent:"explore",url:"/bookmarks",templateUrl:"app/explore/views/bookmarks.html",controller:"BookmarkController",controllerAs:"bookmarks"}),t.otherwise("/"),r.html5Mode(!0)}e.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"],angular.module("digglyFeProto").config(e)}(),function(){"use strict";angular.module("digglyFeProto").constant("malarkey",malarkey).constant("toastr",toastr).constant("moment",moment)}(),function(){"use strict";function e(e,t,r){r.aHrefSanitizationWhitelist(/^\s*(https?|blob):/),e.debugEnabled(!0),t.options.timeOut=3e3,t.options.positionClass="toast-top-right",t.options.preventDuplicates=!0,t.options.progressBar=!0}e.$inject=["$logProvider","toastr","$compileProvider"],angular.module("digglyFeProto").config(e)}(),angular.module("digglyFeProto").run(["$templateCache",function(e){e.put("app/components/fbshare/metaTemplate.html",'<meta property="og:url" content="{{ fbShare.url }}"><meta property="og:type" content="{{ fbShare.website }}"><meta property="og:title" content="{{ fbShare.title }}"><meta property="og:description" content="{{ fbShare.description }}"><meta property="og:image" content="http://rack36.cs.drexel.edu/dist/assets/images/imageSN.jpg">'),e.put("app/components/navbar/navbar.html",'<nav class="top-bar row"><ul class="title-area"><li class="name"><h1><a ui-sref="home">Diggly</a></h1></li></ul><section class="top-bar-section"><ul class="right"><explore-navigation></explore-navigation></ul></section></nav>'),e.put("app/components/search/search.html",'<div class="search-container center"><span class="fa fa-search"></span> <input type="text" placeholder="Search" class="searchBar"><ul class="results"><li ng-repeat="topic in topics">{{topic.title}}</li></ul></div>'),e.put("app/home/views/home.html",'<main class="home"><header><div class="row"><h1 ui-sref="home">diggly</h1><div class="search-wrap"><search-diggly></search-diggly></div></div></header><section class="recent"><div class="row"><h3>Recently Discovered</h3><article class="medium-4 small-12 columns"><div class="card"><h4><a ui-sref="explore({id:37969})">Ramen</a></h4><p>Ramen (/ˈrɑːmən/) (ラーメン, rāmen, IPA: [ɽäꜜːmeɴ]) is a Japanese noodle soup dish. It consists of Chinese-style wheat noodles served in a meat- or (occasionally)...</p><div class="card-btn__container"><a ui-sref="explore({id:37969})"><i class="material-icons">arrow_forward</i></a></div></div></article><article class="medium-4 small-12 columns"><div class="card"><h4><a ui-sref="explore({id:47775352})">Crab Rangoon</a></h4><p>Crab Rangoon, sometimes called crab puffs, crab rangoon puffs, or cheese wontons, are deep-fried dumpling appetizers served in American Chinese and...</p><div class="card-btn__container"><a ui-sref="explore({id:47775352})"><i class="material-icons">arrow_forward</i></a></div></div></article><article class="medium-4 small-12 columns"><div class="card"><h4><a ui-sref="explore({id:1330232})">Spring roll</a></h4><p>Spring rolls are a large variety of filled, rolled appetizers or dim sum found in East Asian and Southeast Asian cuisine. The name is a literal translation of the ...</p><div class="card-btn__container"><a ui-sref="explore({id:1330232})"><i class="material-icons">arrow_forward</i></a></div></div></article></div></section><section class="interest"><div class="row"><article class="medium-4 small-12 columns"><h3>Trending Now</h3><div class="card"><h4><a ui-sref="explore({id:21181})">Nancy Reagan</a></h4><p>Nancy Davis Reagan (born Anne Frances Robbins; July 6, 1921 – March 6, 2016) was an American actress and the wife of the 40th President of the United States...</p><div class="card-btn__container"><a ui-sref="explore({id:21181})"><i class="material-icons">arrow_forward</i></a></div></div></article><article class="medium-4 small-12 columns"><h3>Most Popular</h3><div class="card"><h4><a ui-sref="explore({id:5422144})">Taylor Swift</a></h4><p>Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter. Raised in Wyomissing, Pennsylvania, she moved to Nashville, ...</p><div class="card-btn__container"><a ui-sref="explore({id:5422144})"><i class="material-icons">arrow_forward</i></a></div></div></article><article class="medium-4 small-12 columns"><h3>Something New</h3><div class="card"><h4><a ui-sref="explore({id:3382})">Britney Spears</a></h4><p>Britney Jean Spears (born December 2, 1981) is an American singer and actress...</p><div class="card-btn__container"><a ui-sref="explore({id:3382})"><i class="material-icons">arrow_forward</i></a></div></div></article></div></section></main>'),e.put("app/explore/views/bookmarks.html",'<section class="bookmarks"><article class="medium-8 small-12 columns card bookmarks__card"><div class="heading"><h2>Saved Bookmarks</h2><div class="buttons"><a ng-click="bookmarks.action.clearBookmarks()"><i class="material-icons">delete_sweep</i></a></div></div><ul><li ng-repeat="bookmark in bookmarks.model.bookmarks"><h4>{{ bookmark.article_title}}</h4><p>{{ bookmark.summary | limitTo: 1000 }} ...</p><div class="option-wrap"><a href="{{ bookmark.wiki_link }}" target="_blank"><i class="material-icons">launch</i>Go to Wikipedia</a> <a ng-click="bookmarks.action.removeItem(bookmark)"><i class="material-icons">remove_circle_outline</i>Remove Item</a></div></li></ul></article><div class="medium-4 small-12 columns export"><article ng-cloak="" class="small-12 columns card"><div class="export__card"><h3>Export</h3><div class="export__summary"><p>Export to an external file to save on your local computer.</p></div><form><label for="fileName">File Name:</label> <input name="fileName" type="text" ng-model="bookmarks.model.fileName"><div class="export__selection"><label for="exportSelection">Export Type:</label><select name="exportSelection" ng-model="bookmarks.model.exportType" ng-change="bookmarks.action.export()" ng-options="extension.type as extension.label for extension in bookmarks.model.extensions"><option value="">Choose File Type</option></select></div><div class="export__filter"><div><input name="summary" type="checkbox" ng-model="bookmarks.model.summary" ng-change="bookmarks.action.export()"> <label for="summary">Include Summary</label></div><div><input name="longDesc" type="checkbox" ng-model="bookmarks.model.longDesc" ng-change="bookmarks.action.export()"> <label for="longDesc">Include Long Description</label></div><div><input name="wikiUrl" type="checkbox" ng-model="bookmarks.model.wikiUrl" ng-change="bookmarks.action.export()"> <label for="wikiUrl">Include Wikipedia URL</label></div></div><div class="export__btns"><a ng-href="{{ bookmarks.model.downloadUrl }}" class="export__btn" download="{{ bookmarks.model.fileName }}">Export</a></div></form></div></article></div></section>'),e.put("app/explore/views/history.html",'<section class="history"><article class="card history__card"><div class="heading"><h2>Previously Viewed</h2><div class="buttons"><a ng-click="history.action.clearHistory()"><i class="material-icons">delete_sweep</i></a></div></div><ul><li ng-repeat="topic in history.model.history"><h4>{{ topic.article_title}}</h4><p>{{ topic.summary | limitTo: 300 }} ...</p><div class="option-wrap"><a href="{{ topic.wiki_link }}" target="_blank"><i class="material-icons">launch</i>Go to Wikipedia</a> <a ng-click="history.action.removeItem(topic)"><i class="material-icons">remove_circle_outline</i>Remove Item</a></div></li></ul></article></section>'),e.put("app/explore/views/layout.html",'<header class="app-header"><div class="row"><h1>diggly</h1></div></header><div class="navigation"><nav class="top-bar row"><div class="top-bar-section"><ul class="left"><li><a ui-sref="home">Home</a></li><li ui-sref-active="active"><a ui-sref="explore">Explore</a></li></ul></div><div class="right"><search-diggly></search-diggly></div></nav></div><main class="explore"><div class="row"><nav class="top-bar"><div class="notification" notify-service=""></div><div class="top-bar-section"><div class="left"><h2>Explore</h2></div><ul class="right"><li ui-sref-active="active"><a ui-sref="explore.visual({ history: history })">Visual</a></li><li ui-sref-active="active"><a ui-sref="explore.history({ history: history })">History</a></li><li ui-sref-active="active"><a ui-sref="explore.bookmark">Bookmarks</a></li></ul></div></nav><div class="small-12 columns"><div class="row"><div ui-view=""></div></div></div></div></main>'),e.put("app/explore/views/visual.html",'<section class="visual"><div class="medium-8 small-12 columns"><section ng-cloak="" class="visualizer card"><div class="visual__loader" ng-show="loading"><span class="visual__svg" ng-include="" src="\'app/explore/views/partials/loader.html\'"></span></div><div ng-show="!loading"><div diggly-visual="" class="visualizer-container" data="visual.model.data" on-click="visual.action.onClick(item)"></div></div></section></div><div class="medium-4 small-12 columns quick-info"><article ng-cloak="" class="small-12 columns card"><div class="current-card"><h3>{{ visual.model.currentTopic.article_title }}</h3><div class="current-card__summary"><p>{{ visual.model.currentTopic.summary }}</p></div><div class="current-card__btns"><a ng-href="{{ visual.model.currentTopic.wiki_link }}" target="_blank"><i class="material-icons">launch</i></a> <a class="add-bookmark" ng-click="visual.action.addBookmark(visual.model.currentTopic)"><i class="material-icons">bookmark_border</i></a></div></div></article><article ng-cloak="" class="small-12 columns card"><div class="history-card"><h3>History</h3><div class="history-card__list"><ul><li ng-repeat="topic in visual.model.history"><a ui-sref="explore.visual({ id: topic.article_id })">{{ topic.article_title}}</a><div class="buttons"><a href="{{ topic.wiki_link }}" target="_blank"><i class="material-icons">launch</i></a> <a ng-click="visual.action.addBookmark(topic)"><i class="material-icons">bookmark_border</i></a></div></li></ul></div><div class="buttons"><a class="visual__history-clear" ng-click="visual.action.clearHistory()"><i class="material-icons">delete_sweep</i></a></div></div></article><article ng-cloak="" class="small-12 columns card social"><div class="social-card"><h3>Share</h3><div class="buttons"><div class="fb-share-button" data-layout="icon" data-mobile-iframe="true"></div></div></div></article></div></section>'),e.put("app/explore/views/partials/loader.html",'<svg width="198px" height="198px" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" preserveaspectratio="xMidYMid" class="uil-balls"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g transform="rotate(0 50 50)"><circle r="6" cx="30" cy="50"></circle><animatetransform attributename="transform" type="translate" begin="0s" repeatcount="indefinite" dur="1s" values="0 0;13.819660112501051 -19.02113032590307" keytimes="0;1"><animate attributename="fill" dur="1s" begin="0s" repeatcount="indefinite" keytimes="0;1" values="#c5523f;#f2b736"></animate></animatetransform></g><g transform="rotate(72 50 50)"><circle r="6" cx="30" cy="50"></circle><animatetransform attributename="transform" type="translate" begin="0s" repeatcount="indefinite" dur="1s" values="0 0;13.819660112501051 -19.02113032590307" keytimes="0;1"><animate attributename="fill" dur="1s" begin="0s" repeatcount="indefinite" keytimes="0;1" values="#f2b736;#499255"></animate></animatetransform></g><g transform="rotate(144 50 50)"><circle r="6" cx="30" cy="50"></circle><animatetransform attributename="transform" type="translate" begin="0s" repeatcount="indefinite" dur="1s" values="0 0;13.819660112501051 -19.02113032590307" keytimes="0;1"><animate attributename="fill" dur="1s" begin="0s" repeatcount="indefinite" keytimes="0;1" values="#499255;#1875e5"></animate></animatetransform></g><g transform="rotate(216 50 50)"><circle r="6" cx="30" cy="50"></circle><animatetransform attributename="transform" type="translate" begin="0s" repeatcount="indefinite" dur="1s" values="0 0;13.819660112501051 -19.02113032590307" keytimes="0;1"><animate attributename="fill" dur="1s" begin="0s" repeatcount="indefinite" keytimes="0;1" values="#1875e5;#c5523f"></animate></animatetransform></g><g transform="rotate(288 50 50)"><circle r="6" cx="30" cy="50"></circle><animatetransform attributename="transform" type="translate" begin="0s" repeatcount="indefinite" dur="1s" values="0 0;13.819660112501051 -19.02113032590307" keytimes="0;1"><animate attributename="fill" dur="1s" begin="0s" repeatcount="indefinite" keytimes="0;1" values="#c5523f;#f2b736"></animate></animatetransform></g></svg>')}]);