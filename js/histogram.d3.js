function histogramD3(container) {
   var margin = {top: 20, right: 0, bottom: 30, left: 45},
          width = $(container).width()*0.98 - margin.left - margin.right,
          height = $(container).height()*0.85 - margin.top - margin.bottom;

   var numBins = 20;
   
   var x = d3.scale.linear()
       .range([0, width]);
   var svg = d3.select(container).append("svg")
      .attr("width", '98%')
      .attr("height", '85%')
      .attr('viewBox',"0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom))
      .attr("preserveAspectRatio", "none")
      .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
   function my(values, options) {
      
      if (options && options.noOutliers) {
         var q1 = quantile(values,0.25); 
         var q3 = quantile(values,0.75);
         var iqr = (q3-q1) * 1.5; //
         var minMax = [ Math.max(q1-iqr,0), q3+iqr ];
      } else {
         var minMax = d3.extent(values, function(d) { return parseInt(d[0]); });
      }
      
      // get average
      var totalValue = 0;
      var numValues = 0;
      for (var i=0, len = values.length; i < len; i++) {
         var value = parseInt(values[i][0]);
         if (  value >= minMax[0] && value <= minMax[1] ) {
            totalValue += value * parseFloat(values[i][1]);
            numValues += parseFloat(values[i][1]);
         }
      }
      var avg = totalValue / numValues;
      
      x.domain(minMax);
      // check for single value histogram
      if(x.domain()[0] == x.domain()[1])
            x.domain([ x.domain()[0] - 10, x.domain()[1] + 10 ]);

      var y = d3.scale.linear()
          .domain([0, d3.max(values, function(d) { return d[1]; })])
          .range([height, 0]);
          
      var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat(function (d) {
           if ((d / 1000000) >= 1)
             d = d / 1000000 + "M";
           else if ((d / 1000) >= 1)
             d = d / 1000 + "K";
           return d;            
        })
        .ticks(6)
        .orient("left");      

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

      var bar = svg.selectAll(".bar")
          .data(values)
        .enter().append("g")
          .style("z-index", 5)
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d[0]) + "," + height + ")"; });

      bar.append("rect")
          .attr("x", 1)
          .style("z-index", 5)
          .attr("width", Math.max(x(x.domain()[0]+1),1))
          .attr("height", function(d) { return 0; })
          .on("mouseover", function(d) {  
                   div.transition()        
                       .duration(200)      
                       .style("opacity", .9);      
                   div .html(d[0] + ", " + d[1])                                 
                       .style("left", (d3.event.pageX) + "px") 
                       .style("text-align", 'left')    
                       .style("top", (d3.event.pageY - 24) + "px");    
                   })                  
               .on("mouseout", function(d) {       
                   div.transition()        
                       .duration(500)      
                       .style("opacity", 0);   
             });
          
      // update
      bar = svg.selectAll('.bar');
      bar.transition()
         .duration(200)
         .attr("transform", function(d) { return "translate(" + x(d[0]) + "," + Math.floor(y(d[1])) + ")"; });
         
      bar.select("rect").transition()
         .duration(200)
         .attr("width", Math.max(x(x.domain()[0]+1),1))
         .attr("height", function(d) { return parseInt(d[0]) >= minMax[0] ? Math.ceil(height - y(d[1])) : 0; });
         
      // set avg
      var half = x(x.domain()[0]+1) / 2;
      var avgLineG =  svg.selectAll(".avg")
            .data([avg])
         .enter().append("g")
            .attr("class", "avg")
            .style("z-index", 10)
            .attr("transform", function(d) { return "translate(" + parseInt(x(d)+half) + "," + 0 + ")"; });
      
      var avgLine = avgLineG.append("line")
         .attr("x1", 0)
         .attr("x2", 0)
         .attr("y1", height)
         .attr("y2", -8)
         .style("z-index", 10)
         .style("stroke", "rgb(60,60,60)")
         .style('stroke-dasharray', "5, 5")
         .style("stroke-width", "1px")
      
      var avgText = avgLineG.append("text")
            .text("avg")
            .style("fill", "rgb(180,180,180)")
            .attr("y", "-10");         
         
      svg.selectAll(".avg").transition()
         .duration(200)
         .attr("transform", function(d) { return "translate(" + parseInt(x(d)+half) + "," + 0 + ")"; });

      
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
      
      // update y axis
      if (svg.select(".y.axis").empty()) {
         svg.append("g")
            .attr("class", "y axis")
            // .attr("transform", "translate(0," + height + ")")
            .call(yAxis);
      } else {
         svg.select(".y.axis").transition()
            .duration(200)
            .call(yAxis);
      }
      
      function quantile(arr, p) {
         var length = arr.reduce(function(previousValue, currentValue, index, array){
           return previousValue + currentValue[1];
         }, 0) - 1;
         var H = length * p + 1, 
          h = Math.floor(H);
          
         var hValue, hMinus1Value, currValue = 0;
         for (var i=0; i < arr.length; i++) {
            currValue += arr[i][1];
            if (hMinus1Value == undefined && currValue >= (h-1))
               hMinus1Value = arr[i][0];
            if (hValue == undefined && currValue >= h) {
               hValue = arr[i][0];
               break;
            }
         } 
          var v = +hMinus1Value, e = H - h;
          return e ? v + e * (hValue - v) : v;
      } 
      
   }
   
   my.width = function(value) {
      if (!arguments.length) return width;
      width = value;
      return my;
   };
   
   my.height = function(value) {
      if (!arguments.length) return height;
      height = value;
      return my;
   };
   
   my.numBins = function(value) {
      if (!arguments.length) return numBins;
      numBins = value;
      return my;
   }  
      
   return my;
   
}