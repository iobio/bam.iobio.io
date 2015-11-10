(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// Grab an existing iobio namespace object, or create a blank object
// if it doesn't exist
var iobio = global.iobio || {};
global.iobio = iobio;

// export if being used as a node module - needed for test framework
if ( typeof module === 'object' ) { module.exports = iobio;}

// Create Base Object
iobio.viz = {};

// Add visualizations
iobio.viz.base = require('./viz/base.js')
iobio.viz.circle = require('./viz/circle.js')
iobio.viz.alignment = require('./viz/alignment.js')
iobio.viz.referenceGraph = require('./viz/referenceGraph.js')
iobio.viz.line = require('./viz/line.js')
iobio.viz.bar = require('./viz/bar.js')
iobio.viz.barViewer = require('./viz/barViewer.js')

// Add layouts
iobio.viz.layout = require('./layout/layout.js')

// Add shapes
iobio.viz.svg = require('./svg/svg.js')

// Add utils
iobio.viz.utils = require('./utils.js')

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./layout/layout.js":4,"./svg/svg.js":7,"./utils.js":9,"./viz/alignment.js":10,"./viz/bar.js":11,"./viz/barViewer.js":12,"./viz/base.js":13,"./viz/circle.js":14,"./viz/line.js":15,"./viz/referenceGraph.js":16}],2:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var undefined;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],3:[function(require,module,exports){
var utils = require('../utils.js');

var graph = function() {
    // Defaults
    var sources = function(d) { return d.sources },
        targets = function(d) { return d.targets },
        position = function(d) { return d.position };
    
    function layout(root) {
    	var nodes = [];
    	var visited = {};
    	var uid = utils.getUID();
    	var stack = [ root ];
    	while ((node = stack.pop()) != null) {
    		if (node._visited == uid) continue;
    		nodes.push(node);
    		// mark as visited
    		node._visited = uid;
    		// see if multiple variants at this position
    		var v = visited[position(node)] || (visited[position(node)]=[]);
    		v.push(node);
    		if (v.length ==1 )
    			node.y = 0;
    		else 
    			for (var i=0; i<v.length; i++) {v[i].y = (i/(v.length-1) || 0) * 2 - 1;}    		

    		// push unvisited neighbors on stack
    		var neighbors = [].concat(sources(node), targets(node));    		    		
    		stack = stack.concat( neighbors.filter(function(a) {return a._visited != uid;}) )
    	}
    	return nodes;
    }

    /*
     * Identifies the links between all nodes
     */
    layout.links = function(nodes) {
    	var links = [];
    	nodes.forEach(function(node) {
    		(node.targets || []).map(function(target) {
	        	links.push( {
	          		'source': node,
	          		'target': target
	        	});
	        });
    	})
	    return links;
    }

    /*
     * Specifies the value function *sources*, which returns an array of node objects
     * for each datum. The default value function is `return sources`. The value function
     * is passed two arguments: the current datum and the current index.
     */    
    layout.sources = function(_) {
        if (!arguments.length) return sources;
            sources = _;
            return chart;
    }

    /*
     * Specifies the value function *targets*, which returns an array of node objects
     * for each datum. The default value function is `return targets`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    layout.targets = function(_) {
        if (!arguments.length) return targets;
            targets = _;
            return chart;
    }

    /*
     * Specifies the value function *position*, which returns a nonnegative numeric value
     * for each datum. The default value function is `return position`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    layout.position = function(_) {
        if (!arguments.length) return position;
            position = _;
            return chart;
    }
    // TODO: do these functions still make sense?
    // layout.size = function(x) {
    //   if (!arguments.length) return nodeSize ? null : size;
    //   nodeSize = (size = x) == null ? sizeNode : null;
    //   return tree;
    // };
    // layout.nodeSize = function(x) {
    //   if (!arguments.length) return nodeSize ? size : null;
    //   nodeSize = (size = x) == null ? null : sizeNode;
    //   return tree;
    // };
    return layout;
  };
 
 module.exports = graph;
},{"../utils.js":9}],4:[function(require,module,exports){

var layout = {};
// add layouts
layout.pileup = require('./pileup.js');
layout.graph = require('./graph.js');
layout.pointSmooth = require('./pointSmooth.js');

module.exports = layout;
},{"./graph.js":3,"./pileup.js":5,"./pointSmooth.js":6}],5:[function(require,module,exports){


var pileup = function() {
  // Defaults
  var start = function(d) { return d.start; },
      end = function(d) { return d.end; },    
      sort = 'default',
      size = 400,
      buffer = 0;

  function layout(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+start.call(layout, d, i),+end.call(layout, d, i)]; });
    var xScale = d3.scale.linear()
            .domain( [values[0][0], values[values.length-1][1]] )
            .range([0, size]);

    // Optionally sort the data.
    var index = d3.range(data.length);
    if (sort != null) index.sort(sort === 'default'
        ? function(i, j) { return values[j][0] - values[i][0]; }
        : function(i, j) { return sort(data[i], data[j]); });

    // Compute the piles!
    // They are stored in the original data's order.
    // TODO: handle widhts that are less than a pixel
    var step;
    // var bottomEnd = undefined;
    var piles = [];
    // var ppEnd = []; // previous pile end    
    // var ppCurrStep;
    // var ppLastStep = [];
    // var freeSpots = [ {pos:-1,step:0,index:null}, {pos:null,step:null,index:null}, {pos:null,step:null,index:null} ] ;

    var furthestRight = [];

    // initialize piles
    var currPile = [];
    var prevPile = [];
    var prevPrevPile = [];

    // initialize indices
    var prevPileIndex = 1;

    index.forEach(function(i) { 
      var start = values[i][0];      
      var end = values[i][1];
      step = undefined;

      if( data[i].id == 'HSQ1004:134:C0D8DACXX:1:1201:13648:213371') {
        var h = 5;
      }

      for ( var k=0; k < furthestRight.length; k++) {
        if ( (xScale(furthestRight[k])+buffer) < xScale(start) ) {
          step = k;
          furthestRight[k] = end;
          break;
        }
      }

      if (step == undefined) { step = furthestRight.length; furthestRight.push(end) }
  
      
      // if ( currPile.length==0 || (xScale(currPile[0])+buffer) < xScale(start) ) { // check if you can start a new pile
      //   step = 0;        
        
      //   // move piles up
      //   prevPrevPile = prevPile;
      //   prevPile = currPile;
      //   currPile = [end];

      //   // reset indices
      //   prevPileIndex = 1;

      // } else if ( prevPile.length <= prevPileIndex || (xScale(prevPile[prevPileIndex])+buffer) < xScale(start) )  { // if not, check if you can place in current pile        
      //   step = currPile.length;
      //   currPile.push(end);
      //   prevPileIndex += 1; // update prevPile Index
      // // } else if ( prevPrevPile.length <= prevPile.length || (xScale(prevPrevPile[prevPile.length])+buffer) < xScale(start) )  { // if not, check if you can place in previous pile        
      //   } else if ( prevPrevPile.length <= prevPile.length || (xScale(prevPrevPile[prevPile.length])+buffer) < xScale(start) )  { // if not, check if you can place in previous pile        
      //   step = prevPile.length;
      //   prevPile.push(end);
      // } else  { // if not, assume you can place in pile before previous pile
      //   step = prevPrevPile.length;
      //   prevPrevPile.push(end);        
      // }



      // if (i > 0 && data[i+1].id == 'HSQ1004:134:C0D8DACXX:2:1201:11823:1436240') {        
      // if (data[i+1].id == 'HSQ1004:134:C0D8DACXX:1:1306:2425:1181500') {        
      //   console.log('h');
      //   var h = 5;
      // }
      // if ( bottomEnd != undefined && ((xScale(bottomEnd)+buffer) >= xScale(start)) ) {
      //   if (ppEnd[ppCurrStep] != undefined && (xScale(start) <= (xScale(ppEnd[ppCurrStep])+buffer))) {
      //     for(var i=0; i < ppLastStep.length; i++) {
      //       if (start > ppLastStep[i]) {
      //         ppLastStep[i] += 1;
      //         step = ppLastStep[i];
      //         ppEnd[step] = end;
      //         break;
      //       }
      //     }
      //   } else {
      //     step = ppCurrStep || step+1;
      //     ppCurrStep = step+1;
      //     ppEnd[step] = end;
      //   }
      // }
      // else {
      //   ppLastStep.push(step);
      //   step = 0;
      //   ppCurrStep = 1;
      //   bottomEnd = end;
      // }       
      piles[i] = {
        data: data[i],
        x: start,
        w: end-start,
        y: step
      };      
    });
    return piles;
  }

  /*
   * Specifies the value function *start*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return start`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.start = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return layout;
  };

  /*
   * Specifies the value function *end*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return end`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.end = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return layout;
  };

  /*
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * which features will overlap in pixel space.
   */
  layout.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return layout;
  };

  /*
   * Specifies the buffer needed between features to not be considered an overlap   
   */
  layout.buffer = function(_) {
    if (!arguments.length) return buffer;
    buffer = _;
    return layout;
  };

  /*
   * Specifies the sort function to be used or null if no sort   
   */
  layout.sort = function(_) {
    if (!arguments.length) return sort;
    sort = _;
    return layout;
  };

  return layout;
};

module.exports = pileup;
},{}],6:[function(require,module,exports){


var pointSmooth = function() {
  // Defaults
  var pos = function(d) { return d.pos; },
      depth = function(d) { return d.depth; },
      size = 400;
      epsilonRate = 0.3;

  function layout(data) {

    // Compute the numeric values for each data element and keep original data.    
    var points = data.map(function(d, i) { 
      return {
        data: d,
        pos: +pos.call(layout, d, i),
        depth: +depth.call(layout, d, i)
      };
    });
    
    var epislon = parseInt( epsilonRate * (points[points.length-1].pos - points[0].pos) / size );

    // Compute the points!
    // They are stored in the original data's order.
    points = properRDP(points, epislon);    
    
    return points;
  }

  /*
   * Specifies the value function *pos*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return pos`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.pos = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return layout;
  };

  /*
   * Specifies the value function *depth*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return depth`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.depth = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return layout;
  };

  /*
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * how smoothing will be necessary i.e. smaller size has less resolution and will 
   * require more smoothing.
   */
  layout.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return layout;
  };

  /*
   * Specifies the epislon rate to determine the aggressiveness of the smoothing   
   */
  layout.epsilonRate = function(_) {
    if (!arguments.length) return epsilonRate;
    epsilonRate = _;
    return layout;
  };

  return layout;
};

module.exports = pointSmooth;


/*
 * properRDP
 * 
 * @licence Feel free to use it as you please, a mention of my name is always nice.
 * 
 * Marius Karthaus
 * http://www.LowVoice.nl
 * 
 */ 

function properRDP(points,epsilon){
    var firstPoint=points[0];
    var lastPoint=points[points.length-1];
    if (points.length<3){
        return points;
    }
    var index=-1;
    var dist=0;
    for (var i=1;i<points.length-1;i++){
        var cDist=findPerpendicularDistance(points[i],firstPoint,lastPoint);
        if (cDist>dist){
            dist=cDist;
            index=i;
        }
    }
    if (dist>epsilon){
        // iterate
        var l1=points.slice(0, index+1);
        var l2=points.slice(index);
        var r1=properRDP(l1,epsilon);
        var r2=properRDP(l2,epsilon);
        // concat r2 to r1 minus the end/startpoint that will be the same
        var rs=r1.slice(0,r1.length-1).concat(r2);
        return rs;
    }else{
        return [firstPoint,lastPoint];
    }
}

function findPerpendicularDistance(p, p1,p2) {
    // if start and end point are on the same x the distance is the difference in X.
    var result;
    var slope;
    var intercept;
    if (p1.pos==p2.pos){
        result=Math.abs(p.pos-p1.pos);
    }else{
        slope = (p2.depth - p1.depth) / (p2.pos - p1.pos);
        intercept = p1.depth - (slope * p1.pos);
        result = Math.abs(slope * p.pos - p.depth + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    }
   
    return result;
}
},{}],7:[function(require,module,exports){

var svg = {};
// add shapes
svg.variant = require('./variant.js');

module.exports = svg;
},{"./variant.js":8}],8:[function(require,module,exports){
var variant = function() { 
    
    // Value transformers
    var xValue = function(d) { return d.x; },
        yValue = function(d) { return d.y; },
        wValue = function(d) { return d.w; },
        hValue = function(d) { return d.h; };

    var diagonal = d3.svg.diagonal()        

    function shape(d, i) {    
        diagonal
            .source(function(d) { return {"x":hValue(d)*d.y, "y":d.x+Math.abs(d.w/2)}; })            
            .target(function(d) { return {"x":0, "y":d.x+d.w/2+Math.abs(d.w/2)}; })
            .projection(function(d) { return [d.y, d.x]; });
        
        var variantH = hValue(d);
        var bulbW = Math.abs(variantH * 5/6);
        // Create control points
        var c1 = variantH * 1/6+yValue(d),
            c2 = variantH*2/6+yValue(d),
            c3 = variantH*0.625+yValue(d),
            c4 = variantH*1.145+yValue(d);

        if (wValue(d) <= Math.abs(bulbW/2))
            return "M" +xValue(d)+","+yValue(d)+" C" +xValue(d)+ "," +c1+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d))+"," +c1+" "+parseInt(xValue(d)+wValue(d))+","+yValue(d);            
        else
            return diagonal(d)+diagonal({x:xValue(d), y:yValue(d), w:-wValue(d)});
    }

    /*
     * Specifies the value function *x*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.xValue = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return shape;
    }

    /*
     * Specifies the value function *y*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.yValue = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return shape;
    };

    /*
     * Specifies the value function *width*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.wValue = function(_) {
        if (!arguments.length) return wValue;
        wValue = _;
        return shape;
    }; 

    /*
     * Specifies the value function *height*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.hValue = function(_) {
        if (!arguments.length) return hValue;
        hValue = _;
        return shape;
    }; 

    return shape;
};

module.exports = variant;
},{}],9:[function(require,module,exports){

module.exports.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;            
}

module.exports.getUID = function(separator) {    	
    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());	
}

module.exports.value_accessor = function(value, d) {
	return typeof value === 'function' ? value(d) : value;
}

module.exports.tooltipHelper = function(selection, tooltipElem, titleAccessor) {
	var utils = require('./utils.js')
	selection
		.on("mouseover", function(d,i) {    
			var tooltipStr = utils.value_accessor(titleAccessor, d); // handle both function and constant string
			var opacity = tooltipStr ? .9 : 0; // don't show if tooltipStr is null
			tooltipElem.transition()        
				.duration(200)      
				.style("opacity", opacity);      
			tooltipElem.html(tooltipStr)
				.style("left", (d3.event.pageX) + "px") 
				.style("text-align", 'left')
				.style("top", (d3.event.pageY - 24) + "px");    
		})
		.on("mouseout", function(d) {       
			tooltipElem.transition()        
				.duration(500)      
				.style("opacity", 0);   
		})
}
},{"./utils.js":9}],10:[function(require,module,exports){
var alignment = function() {
	// Import base chart
	var base = require('./base.js')();
	var utils = require('../utils.js');

	// Defaults
	var elemHeight = 4,
		orientation = 'down',
		events = [],
		tooltip;

	function chart(selection, options) {
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			id = base.id();
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue();		

		// Change orientation of pileup
		if (orientation == 'down') {
			// swap y scale min and max
			y.range([y.range()[1],y.range()[0]]);
			// update y axis			
			selection.select(".iobio-y.iobio-axis").transition()
				.duration(0)
				.call(base.yAxis());
		}

		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum())
			.enter().append('rect')
				.attr('class', 'rect')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) - elemHeight + 2 })				
				.attr('id', function(d) { return id(d)})
				.attr('width', function(d) { 
					return x(xValue(d)+wValue(d)) - x(xValue(d));
				})
				.attr('height', function(d) { return elemHeight });

		// Add title on hover	   
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')   	
	    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			g.selectAll('.rect').on(ev.event, cb);			
		})	

	}
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);

	/*
   	 * Specifies the orientation of the alignment. Can be 'up' or 'down'   
   	 */
  	chart.orientation = function(_) {
    	if (!arguments.length) return orientation;
    	orientation = _;
    	return chart;
  	};

	/*
   	 * Set events on rects
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover rects
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart; 
	}

	return chart;
}

// Export alignment
module.exports = alignment;
},{"../utils.js":9,"./base.js":13}],11:[function(require,module,exports){
var bar = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		transitionDuration = 200;

	// Default Options
	var defaults = { yMin: 0 };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			id = base.id();
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue(),
			innerHeight = base.height() - base.margin().top - base.margin().bottom;		

		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum(), function(d) { return d[0]; })
			.enter().append('rect')
				.attr('class', 'rect')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) })				
				.attr('id', function(d) { return id(d)})				
				.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(xValue(d));})
				.attr('height', function(d) { return innerHeight - y(yValue(d)); });

		g.selectAll('.rect').transition()
			.duration( transitionDuration )
			.attr('x', function(d) { return x(xValue(d)) })
			.attr('y', function(d) { return y(yValue(d)) })				
			.attr('id', function(d) { return id(d)})				
			.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(xValue(d));})
			.attr('height', function(d) { return innerHeight - y(yValue(d)); });

		// Add title on hover	   
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')   	
	    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			g.selectAll('.rect').on(ev.event, cb);			
		})	

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on rects
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover rects
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart; 
	}

	return chart;
}

// Export alignment
module.exports = bar;
},{"../utils.js":9,"./base.js":13,"extend":2}],12:[function(require,module,exports){
var barViewer = function() {
	// Import base chart
	var base = require('./base.js')(),
		bar = require('./bar.js'),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		sizeRatio = 0.8;

	// Default Options
	var defaults = { };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// // Call base chart		
		// base.call(this, selection, options);

		selection.selectAll('div')
				.data([0,0])
			.enter().append('div')
				.attr('id', function(d,i) { return 'iobio-bar-' + i });
		
		var focalMargin = chart.margin();
		// focalMargin.bottom = 0;
		// Call big bar chart
		var focalBar = bar()
			.height( base.height() * sizeRatio )
			.margin( focalMargin );
		var focalSelection = d3.select('#iobio-bar-0').datum( selection.datum() )
		focalBar(focalSelection, options);

		// Call little bar chart
		var globalMargin = chart.margin();
		// globalMargin.top = 0;
		var globalBar = bar()
			.height( base.height() * (1-sizeRatio) )
			.yAxis( null )
			.margin( globalMargin )
			.brush('brush', function() { 
				var x2 = globalBar.x(), brush = globalBar.brush();
	        	var x = brush.empty() ? x2.domain() : brush.extent();
	        	var datum = globalSelection.datum().filter(function(d) { return (d[0] >= x[0] && d[0] <= x[1]) });
	           	focalBar( focalSelection.datum(datum), options );
			});

		var globalSelection = d3.select('#iobio-bar-1').datum( selection.datum() )
		globalBar(globalSelection, options);

		// // Add title on hover	   
	 //    if (tooltip) {	 
	 //    	var tt = d3.select('.iobio-tooltip')   	
	 //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	 //    }

	 //    // Attach events
		// events.forEach(function(ev) {
		// 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
		// 	g.selectAll('.rect').on(ev.event, cb);			
		// })	

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on rects
   	 */
	chart.sizeRatio = function(_) {
		if (!arguments.length) return sizeRatio;
		sizeRatio = _;
		return chart; 
	};

	/*
   	 * Set events on rects
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover rects
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
		tooltip = _;
		return chart; 
	}

	return chart;
}

// Export alignment
module.exports = barViewer;
},{"../utils.js":9,"./bar.js":11,"./base.js":13,"extend":2}],13:[function(require,module,exports){
var utils = require('../utils.js'),
	extend = require('extend');

var base = function() {
    // Initialize

	// Dimensions
	var margin = {top: 0, right: 0, bottom: 0, left:0},
	    width = 800,
	  	height = 500;  
	
	// Scales
	var x = d3.scale.linear().nice(),
	    y = d3.scale.linear().nice();
	
	// Axes
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")         
			.tickFormat(utils.format_unit_names)
			.ticks(5),
		yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5);			            
	
	// Value transformers
	var xValue = function(d) { return d[0]; },
   	 	yValue = function(d) { return d[1]; },
       	wValue = function(d) { return d[2] || 1 },
       	id = function(d) { return null; };
	
	// Defaults
	var events = [],
		tooltip,
		brush = d3.svg.brush(),
		preserveAspectRatio;

	// Default options
	var defaults = {};

	function chart(selection, opts) {
		var options = {};
		extend(options, defaults, opts);			
      
      	// Get container      	
      	var container = d3.select( selection.node() );
      	var data = selection.datum();

      	// Select the svg element, if it exists.
		var svg = container.selectAll("svg").data([0]);
		this.svg = svg;

   		// Otherwise, create svg.      
		var gEnter = svg.enter().append("svg").append('g').attr('class', 'container');      				
		var g = svg.select('g');

		// Update the outer dimensions.
      	svg.attr("width", width)
        	.attr("height", height);

      	// Update the inner dimensions.
		g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Get width, height in pixels (necessary to allow percentages to work)
		var widthPx = svg.node().getBoundingClientRect().width;
		var heightPx = svg.node().getBoundingClientRect().height;
		var innerHeight = heightPx - margin.top - margin.bottom;

		// Make svg resize when window resizes		
		svg.attr('viewBox', '0 0 ' + widthPx + ' ' + heightPx);
		if (preserveAspectRatio) svg.attr('preserveAspectRatio', preserveAspectRatio);
		container.style('-webkit-flex', '1 1 auto')
		container.style('flex', '1 1 auto')
		container.style('-webkit-order', '1')
		container.style('order', '1')		

		// Convert data to standard representation greedily;
   		// this is needed for nondeterministic accessors.
   		data = data.map(function(d, i) {return [xValue.call(data, d, i), yValue.call(data, d, i), wValue.call(data, d, i)];});			

   		var xMin = (options.xMin === undefined || options.xMin === null) ? d3.min(data, function(d) { return d[0]}) : options.xMin;
   		var xMax = (options.xMax === undefined || options.xMax === null) ? d3.max(data, function(d) { return d[0]+d[2]}) : options.xMax;

		// Update x scale
		x.domain([xMin, xMax]);         
		x.range([0, widthPx - margin.left - margin.right]);
		
		var yMin = (options.yMin === undefined || options.yMin === null) ? d3.min(data, function(d) { return d[1]}) : options.yMin;
		var yMax = (options.yMax === undefined || options.yMax === null) ? d3.max(data, function(d) { return d[1]}) : options.yMax;
   		
		// Update y scale
		y.domain( [yMin, yMax] )
   	 	 .range([innerHeight , 0]);

   	 	// Flesh out skeletal chart
   	 	gEnter.append("g").attr("class", "iobio-x iobio-axis").attr("transform", "translate(0," + y.range()[0] + ")");
   	 	gEnter.append("g").attr("class", "iobio-y iobio-axis");
   		gEnter.append("g").attr("class", "iobio-x iobio-brush");
   		d3.select("body").append("div").attr("class", "iobio-tooltip").style("opacity", 0);

		// Update the x-axis.
		if(xAxis)
			g.select(".iobio-x.iobio-axis").transition()
				.duration(200)
				.call(xAxis);
		  
		// Update the y-axis.
		if(yAxis)	
			g.select(".iobio-y.iobio-axis").transition()
				.duration(200)
				.call(yAxis);	

		// Add title on hover
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')
	    		    	
	    	svg
				.on("mouseover", function(d,i) {
					var pos = {
			    		x: parseInt(x.invert(d3.event.pageX - svg.node().getBoundingClientRect().left - margin.left )),
			    		y: parseInt(y.invert(d3.event.pageY - svg.node().getBoundingClientRect().top - margin.top ))
			    	}					
					var opacity = tooltip.call(chart, svg, pos) ? .9 : 0; // don't show if tooltipStr is null
					tt.transition()        
						.duration(200)      
						.style("opacity", opacity);      
					tt.html(tooltip.call(chart, svg, pos))
						.style("left", (d3.event.pageX) + "px") 
						.style("text-align", 'left')
						.style("top", (d3.event.pageY - 24) + "px");    
				})
				.on("mouseout", function(d) {       
					tt.transition()        
						.duration(500)      
						.style("opacity", 0);   
				})
		    	.on("mousemove", function() { 
		    		var pos = {
			    		x: parseInt(x.invert(d3.event.pageX - svg.node().getBoundingClientRect().left - margin.left )),
			    		y: parseInt(y.invert(d3.event.pageY - svg.node().getBoundingClientRect().top - margin.top ))
			    	}	    	
		    		var opacity = tooltip.call(chart, svg, pos) ? .9 : 0; // don't show if tooltip is null 
		    		tt.style('opacity', opacity)
		            tt.html( tooltip.call(chart, svg, pos) )
		               .style("left", (d3.event.pageX) + "px") 
		               .style("top", (d3.event.pageY - 24) + "px");
	          })    
	    }

	    // Add brush 
	    if( brush.on("brushend") || brush.on("brushstart") || brush.on("brush") ) {
	    	brush.x(x);
      		svg.select(".iobio-brush")					
					.call(brush)
				.selectAll("rect")
					.attr("y", -6)
					.attr("height", innerHeight + 6);
	    }

		// Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			svg.on(ev.event, cb);
		})		
		
		return data;
	}

	// member functions
	chart.margin = function(_) {
    	if (!arguments.length) return margin;
    	margin = _;
    	return chart;
  	};

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	chart.x = function(_) {
		if (!arguments.length) return x;
		x = _;
		return chart;
	};

	chart.y = function(_) {
		if (!arguments.length) return y;
		y = _;
		return chart;
	};

	chart.xValue = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	chart.yValue = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	chart.wValue = function(_) {
		if (!arguments.length) return wValue;
		wValue = _;
		return chart;
	};  

	chart.id = function(_) {
		if (!arguments.length) return id;
		id = _;
		return chart; 
	}; 

	chart.xAxis = function(_) {
		if (!arguments.length) return xAxis;
		xAxis = _;
		return chart; 
	};

	chart.yAxis = function(_) {
		if (!arguments.length) return yAxis;
		yAxis = _;
		return chart; 
	};

	chart.preserveAspectRatio = function(_) {
		if (!arguments.length) return preserveAspectRatio;
		preserveAspectRatio = _;
		return chart; 
	};

	/*
   	 * Add brush to chart
   	 */	
	chart.brush = function(event, listener) {
		if (!arguments.length) return brush;
		brush.on(event, function() {listener.call(chart, svg)} );
		return chart; 
	}

	/*
   	 * Add events to chart
   	 */
	chart.onChart = function(event, listener) {
		if (!arguments.length) return events;
		events.push({'event': event, 'listener': listener});
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover chart
   	 */
	chart.tooltipChart = function(_) {
		if (!arguments.length) return tooltip;
		tooltip = _;
		return chart; 
	}	

	// utility functions

	/*
   	 * Easy method to rebind base chart functions to the caller chart
   	 */
	chart.rebind = function(object) {
		d3.rebind(object, this, 'margin', 'width', 'height', 'x', 'y', 'id',
			'xValue', 'yValue', 'wValue', 'xAxis', 'yAxis', 'brush', 'onChart', 
			'tooltipChart', 'preserveAspectRatio');
	}

	return chart
}

module.exports = base;

},{"../utils.js":9,"extend":2}],14:[function(require,module,exports){
var circle = function() {
	// Import base chart
	var base = require('./base.js')();

	// Initialize
	var height = 4;	

	function chart(selection, options) {		
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue();		
		
		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum())
			.enter().append('rect')
				.attr('class', 'rect')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) - height })				
				.attr('width', function(d) { 
					return x(xValue(d)+wValue(d)) - x(xValue(d));
				})
				.attr('height', function(d) { return height });
	}
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);		

	return chart;
}

// Export circle
module.exports = circle;
},{"./base.js":13}],15:[function(require,module,exports){
var line = function(container) {
    // Import base chart
    var base = require('./base.js')();
    var utils = require('../utils.js');

    // Defaults
    var numBins = 4,        
        events = [],
        tooltip;
   // var margin = {top: 0, right: 30, bottom: 30, left: 30},
   //        width = $(container).width()*0.98 - margin.left - margin.right,
   //        height = $(container).height()*0.60 - margin.top - margin.bottom;

   // var numBins = 20;
   
   // var x = d3.scale.linear()
   //     .range([0, width]);
       
   // var brush = d3.svg.brush()
   //    .x(x);
          
   // var svg = d3.select(container).append("svg")
   //    .attr("width", '98%')
   //    .attr("height", '60%')
   //    .attr('viewBox',"0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom))
   //    .attr("preserveAspectRatio", "none")
   //    .append("g")
   //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    function chart(selection, options) {
        // Call base chart
        base.call(this, selection, options);

        // Grab base functions for easy access
        var x = base.x(),
            y = base.y(),
            id = base.id();
            xValue = base.xValue(),
            yValue = base.yValue(),         
            wValue = base.wValue();

        // Draw
        var lineGen = d3.svg.line()
            .interpolate("linear")
            .x(function(d,i) { return +x( xValue(d) ); })
            .y(function(d) { return +y( yValue(d) ); })

        var g = selection.select('g.container'); // grab container to draw into (created by base chart)     
        g.select(".read-depth-path").remove();
      
        var path = g.append("path")
           .attr('class', "line")
           .attr("d", lineGen(selection.datum()) )
           .attr("stroke", "steelblue")
           .attr("stroke-width", "2")
           .attr("fill", "none");

         var totalLength = path.node().getTotalLength();

         path
           .attr("stroke-dasharray", totalLength + " " + totalLength)
           .attr("stroke-dashoffset", totalLength)
           .transition()
             .duration(2000)
             .ease("linear")
             .attr("stroke-dashoffset", 0);


      
   }

    // Rebind methods in 2d.js to this chart
    base.rebind(chart);
   
   // my.on = function(ev, listener) { 
   //    if (ev == "brush" || ev == "brushstart" || ev == "brushend")
   //       brush.on(ev, function() { listener(x,brush); } );
   //    return my;
   // }
   
   // my.brush = function(value) {
   //    if (!arguments.length) return brush;
   //    brush = value;
   //    return my;
   // };
   
   return chart;
}

// Export circle
module.exports = line;

},{"../utils.js":9,"./base.js":13}],16:[function(require,module,exports){
var referenceGraph = function() {
	var graph = require('../layout/graph.js')();
	var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.y, d.x]; });
    var utils = require('../utils.js')

	// Import base chart
	var base = require('./base.js')();

	// Defaults
	var elemHeight = 10,
		orientation = 'down',
		levelHeight = 50,
		events = [],
		tooltip,
		variant = iobio.viz.svg.variant();

	// Remove y axis
	base.yAxis(null);

	function chart(selection, options) {		
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y().domain([-1,1]),
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue();

		// Set variant accessors
		variant
			.xValue(function(d) { return x(+xValue(d)); })
			.wValue(function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d)); })			
			.yValue(function(d) { return yValue(d)>0 ? y(0)+elemHeight : y(0); })			
			.hValue(function(d) { return levelHeight * yValue(d); });

		// Draw nodes
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)
		var gEnter = g.selectAll('g.node')
				.data(selection.datum(), function(d) { return d.id ; })
			.enter().append('svg:g')
				.attr('class', 'node')				
		
		// Draw line
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) == 0 })
			.append("svg:rect")			
				.attr('id', function(d) { return id(d)})	
				.attr('x', function(d) { return x(+xValue(d)); })	
				.attr('y', function(d) { return y(+yValue(d)); })			
				.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d));})
				.attr('height', function(d) { return elemHeight })
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Draw Variants
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) != 0 })
			.append("svg:path")			
				.attr('id', function(d) { return id(d)})
				.attr('d', variant)
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Add title on hover
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')   	
	    	utils.tooltipHelper(g.selectAll('.node'), tt, tooltip);
	    }

	    // Add events
		if (events.length > 0) {
			var rect = g.selectAll('.node');
			events.forEach(function(event) {
				rect.on(event.type, event.action)
			})
		}
	}
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on variants
   	 */
	chart.on = function(type, action) {
		events.push( {'type':type, 'action':action})
		return chart;
	}

	/*
   	 * Set height of variant levels
   	 */
	chart.levelHeight = function(_) {
		if (!arguments.length) return levelHeight;
		levelHeight = _;
		return chart; 
	}

	/*
   	 * Set drawing function for variants. Function must have the following 
   	 * accessor functions:
   	 * xValue, yValue, wValue, hValue
   	 */
	chart.variant = function(_) {
		if (!arguments.length) return variant;
		variant = _;
		return chart; 
	}

	/*
   	 * Set tooltip that appears when mouseover variants
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart; 
	}

	return chart;
}

// Export referenceGraph
module.exports = referenceGraph;
},{"../layout/graph.js":3,"../utils.js":9,"./base.js":13}]},{},[1])


//# sourceMappingURL=iobio.viz.js.map