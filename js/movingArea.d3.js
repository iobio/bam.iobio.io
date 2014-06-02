function movingAreaD3(container) {
   var margin = {top: 0, right: 30, bottom: 30, left: 30},
          width = $(container).width()*0.98 - margin.left - margin.right,
          height = $(container).height()*0.60 - margin.top - margin.bottom;

   var numBins = 20;
   var color = d3.scale.category10();   
   
   var x = d3.scale.linear()
       .range([0, width]);
   var y = d3.scale.linear();
       
   var brush = d3.svg.brush()
      .x(x);
   var svg = d3.select(container).select('svg g');    
  
   function my(data, options) {
   	  
	  var epsilonRate = 0.15;
	  var length = data[0].data[data[0].data.length-1][0] - data[0].data[0][0];
	  var epislon = parseInt( epsilonRate * length / width );        
	  var pointsLower = data[0].data.map(function(d) { return [d[0],d[1] ]; });
	  var pointsHigher = data[0].data.map(function(d) { return [d[0],d[2] ]; });
	  // reduce points for lower stroke of area
	  pointsLower = properRDP(pointsLower, epislon);
	  // reduce points for higher stroke of area
	  pointsHigher = properRDP(pointsHigher, epislon);
	  // combine reduction
	  var newData = [], iLower = 0, iHigher = 0;
	  for ( var i=0,l=data[0].data.length; i < l; i++) {
	  	var pos = data[0].data[i][0];
	  	var add = false
	  	if (pos == pointsLower[iLower][0]) {
	  		add = true;
	  		iLower++;
	  	}	  		
	  	if (pos == pointsHigher[iHigher][0]) {
	  		add = true;
	  		++iHigher
	  	}	  		
	  	if (add)
	  		newData.push(data[0].data[i])
	  }
	  data[0].data = newData;

      
      var xDomain = options && options.xDomain || d3.extent(data[0].data, function(d){ return d[0]; });  
      x.domain(xDomain);           
      var yDomain = options && options.yDomain || [1, d3.max(data[0].data, function(d){ return d[2]; })];
      y.domain(yDomain);
      y.range([height,0]);
      
      var xAxis = d3.svg.axis()
          .scale(x)
          .tickFormat(function (d) {
             if ((d / 1000000) >= 1)
               d = d / 1000000 + "M";
             else if ((d / 1000) >= 1)
               d = d / 1000 + "K";
             return d;            
          })
          .orient("bottom");
      
       // add mouseover
       var formatter = d3.format(',');
       svg.on("mouseover", function() {  
             div.transition()        
                 .duration(200)      
                 .style("opacity", .9);      
             div .html(formatter(parseInt(x.invert(d3.event.pageX - $(this).position().left))))
                 .style("left", (d3.event.pageX) + "px") 
                 .style("text-align", 'left')    
                 .style("top", (d3.event.pageY - 24) + "px");    
             })                  
         .on("mousemove", function() {       
            div.html(formatter(parseInt(x.invert(d3.event.pageX - $(this).position().left))))
               .style("left", (d3.event.pageX) + "px") 
               .style("top", (d3.event.pageY - 24) + "px");
          })               
         .on("mouseout", function() {       
             div.transition()        
                 .duration(500)      
                 .style("opacity", 0);   
       });         
         
      var area = d3.svg.area()
        .interpolate("linear")
        .x(function(d,i) { 
        	return parseInt(x(d[0])); 
        })
        .y0(function(d) { 
        	return parseInt(y(d[1])); })
        .y1(function(d) { return parseInt(y(d[2])); })

      var path = svg.selectAll(".read-depth-path").data(data, function(d) { return d.name });   
      path.exit().remove();
      path.transition()
        .duration(2000)
        .attr("d", function(d) { return area(d.data)})

      var pathEnter = path.enter().append("path")
        .attr('class', "read-depth-path")
        .attr("d", function(d){
        	return area(d.data);
        })
        .attr("stroke", '#2d8fc1')
        .attr("stroke-width", "1")
        .attr("fill", "white");
      
         // var path = svg.append("path")
         //   .attr('class', "read-depth-path")
         //   .attr("d", line(data))
         //   .attr("stroke", "steelblue")
         //   .attr("stroke-width", "2")
         //   .attr("fill", "none");

      var totalLength = path.node().getTotalLength();

      pathEnter
        .transition()
          .delay(1000)
          .duration(2000)
          .attr("fill", '#2d8fc1')

         // path
         //   .attr("stroke-dasharray", totalLength + " " + totalLength)
         //   .attr("stroke-dashoffset", totalLength)
         //   .transition()
         //     .duration(2000)
         //     .ease("linear")
         //     .attr("stroke-dashoffset", 0);      

         
      // update x axis
      if (svg.select(".x.axis").empty()) {
         svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
      } else {
         svg.select(".x.axis").transition()
            .duration(200)
            .call(xAxis);
      }

      svg.append("g")
            .attr("class", "x brush")
            .call(brush)
          .selectAll("rect")
            .attr("y", -6)
            .attr("height", height + 6);
      
   }
   my.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return my;
  };

  my.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return my;
  };

   my.on = function(ev, listener) { 
      if (ev == "brush" || ev == "brushstart" || ev == "brushend")
         brush.on(ev, function() { listener(x,brush); } );
      return my;
   }
   
   my.brush = function(value) {
      if (!arguments.length) return brush;
      brush = value;
      return my;
   };
   
   return my;
}