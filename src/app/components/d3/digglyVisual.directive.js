(function() {
  'use strict';

  angular
    .module('digglyFeProto')
    .directive('digglyVisual', digglyVisual);

  /** @ngInject */
  function digglyVisual(d3Service, $window) {
    var directive = {
      restrict: 'EA',
      scope: {
        data: '=',
        onClick: '&'
      },
      link: function(scope, element) {
        var m = scope.model = {
          d3Data: {
            nodes: '',
            edges: ''
          }
        };

        d3Service.d3().then(function(d3) {
            // D3 Code here after it's been loaded dynamically
            var svg = d3.select(element[0])
              .append('svg')
              .style('width', '100%')
              .style('height', '100%');

            // Watchers
            // Browser onresize event, and digest data
            $window.onresize = function() {
              scope.$apply();
            };

            // Watches for resizing and rerenders datas
            scope.$watch(function(){
              return angular.element($window)[0].innerWidth;
            }, function() {
              if (angular.element($window)[0].innerWidth < 1024) {
                scope.updateDim();
              }
            });

            // Watches for scope.data change, and renders the SVG
            scope.$watch('data', function(newVal, oldVal) {
              if (oldVal !== newVal) {
                scope.render(newVal);
              }
            }, false);

            var baseHeight = $('.visualizer').height();
            var baseWidth = $('.visualizer').width();
            var linkDistance = Math.round(baseWidth / 4);

            scope.updateDim = _.debounce(function () {
              baseWidth = $('.visualizer').width();
              baseHeight = $('.visualizer').height();
              linkDistance = Math.round(baseWidth / 4);
              scope.render(scope.data);
            }, 300);

            scope.render = function (data) {
              // Clear out SVGs first
              svg.selectAll('*').remove();

              // When nothing exist, return
              if (!data) {
                return;
              }

              // Set up Data
              m.d3Data.nodes = createNodeData(data);
              m.d3Data.edges = createEdges(data.linked_topics.length);

              var colors = d3
                .scale
                .category10();

              var force = d3
                .layout
                .force()
                .nodes(m.d3Data.nodes)
                .links(m.d3Data.edges)
                // not sure why there is an offset on height?
                .size([baseWidth, baseHeight])
                .linkDistance(linkDistance)
                .charge([-500])
                .theta(0.1)
                .gravity(0.05)
                .on('tick', tick)
                .start();

              var edges = svg
                .selectAll('line')
                .data(m.d3Data.edges)
                .enter()
                .append('line')
                .attr('id', function(d,i) {
                  return 'edge' + i;
                })
                .attr('marker-end','url(#marker_circle)')
                .style('stroke','#ccc')
                .style('pointer-events', 'none');

              var nodes = svg
                .selectAll('circle')
                .data(m.d3Data.nodes)
                .enter()
                .append('circle')
                .attr({
                  'r': function(d) {
                      return d.score * 40; // TODO: Find a better number or dynamic number based on sizing
                  },
                  'class': function(d, i) {
                      return 'node-' + i;
                  }
                })
                .style('fill', function(d, i) {
                  return colors(i);
                })
                .call(force.drag)
                .on('click', function(d, i) {
                  if (i !== 0) {
                    var selectedId = d.target_id;
                    scope.onClick({item: selectedId});
                  }
                });


              var nodelabels = svg
                .selectAll('.nodelabel')
                .data(m.d3Data.nodes)
                .enter()
                .append('text')
                .attr({
                  'x': function (d) {
                    return d.x;
                  },
                  'y': function (d) {
                    return d.y;
                  },
                  'class': function(d, i) {
                    return 'label-' + i;
                  },
                  'stroke': 'black'
                })
                .on('click', function(d, i) {
                  if (i !== 0) {
                    var selectedId = d.target_id;
                    scope.onClick({item: selectedId});
                  }
                })
                .text(function(d) {
                  return d.title;
                });

              var edgepaths = svg
                .selectAll('.edgepath')
                .data(m.d3Data.edges)
                .enter()
                .append('path')
                .attr({
                  'd': function(d) {
                    return 'M ' + d.source.x + ' '+ d.source.y+' L '+ d.target.x +' '+ d.target.y;
                  },
                 'class':'edgepath',
                 'fill-opacity':0,
                 'stroke-opacity':0,
                 'fill':'blue',
                 'stroke':'red',
                 'id': function(d, i) {
                    return 'edgePath-' + i;
                 }
                })
                .style('pointer-events', 'none');

              var edgelabels = svg
                .selectAll('.edgelabel')
                .data(m.d3Data.edges)
                .enter()
                .append('text')
                .style("pointer-events", "none")
                .attr({
                  'class':'edgelabel',
                  'id': function(d, i) {
                    return 'edgelabel-' + i;
                  },
                  'dx':80,
                  'dy':0,
                  'font-size':10,
                  'fill':'#aaa'
                });

              edgelabels
                .append('textPath')
                .attr('xlink:href',function(d,i) {
                  return '#edgepath' + i;
                })
                .style("pointer-events", "none");

              svg
                .append('defs')
                .append('marker')
                .attr({
                  'id':'arrowhead',
                  'viewBox':'-0 -5 10 10',
                  'refX':25,
                  'refY':0,
                  //'markerUnits':'strokeWidth',
                  'orient':'auto',
                  'markerWidth':10,
                  'markerHeight':10,
                  'xoverflow':'visible'
                })
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#ccc')
                .attr('stroke','#ccc');

              var tick = function () {
                edges
                  .attr({
                    "x1": function(d) { return d.source.x; },
                    "y1": function(d) { return d.source.y; },
                    "x2": function(d) { return d.target.x; },
                    "y2": function(d) { return d.target.y; }
                  });

                nodes
                  .attr({
                    "cx": function(d) { return d.x; },
                    "cy": function(d) { return d.y; }
                  });

                nodelabels
                  .attr("x", function(d) { return d.x; })
                  .attr("y", function(d) { return d.y; });

                edgepaths
                  .attr('d', function(d) {
                    var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                    return path;
                  });
              };

              force.on("tick", tick);
            }; // End of Scope Render
        });
      }
    };

    /**
     * It normalizes the response to create a main node
     * This is called in createNodeData, but needs to return as array.
     * to prevent mutation of array, which goes haywire on a render.
     *
     * @param  {object} data JSON of Diggly Backend
     * @return {array}      a nested mainNode object within an array
     */
    var createMainNode = function(data) {
      var mainNode = {};
      mainNode = _.omit(data, ['linked_topics']);
      mainNode.title = mainNode.article_title;
      mainNode.score = 1; // Highest relevancy because it is the topic itself

      return [mainNode];
    };

    /**
     * Creates a normalized D3 ready dataset
     * It has a subcall of .createMainNode which is placed
     * into the dataset.nodes array
     *
     * @param  {object} data JSON response of Diggly Backend of Explore Topics
     * @return {object}      D3 Dataset
     */
    var createNodeData = function(data) {
      var nodes = _.union(createMainNode(data), data.linked_topics);

      return nodes;
    };

    var createEdges = function(edgeCount) {
      var edges = _.times(edgeCount, function(number) {
        return {
          source: number + 1,
          target: 0 // target back to main node.
        };
      });

      return edges;
    };

    return directive;
  }

})();
