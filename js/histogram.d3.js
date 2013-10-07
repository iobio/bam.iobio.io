function histogramD3(container, heightPct) {
   var margin = {top: 20, right: 30, bottom: 30, left: 30},
          width = $(container).width()*0.98 - margin.left - margin.right,
          height = $(container).height()*0.85 - margin.top - margin.bottom;
   // var width = $(container).width() * 0.98;
   // var height = $(container).height() * 0.85;
   var formatCount = d3.format(",.0f");
   
   var x = d3.scale.linear()
       .range([0, width]);
   var svg = d3.select(container).append("svg")
      .attr("width", '98%')
      .attr("height", '85%')
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      // .attr('viewBox',"0 0 794 173")
      .attr('viewBox',"0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom))
      .attr("preserveAspectRatio", "none")
      .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   

   function my(values, otherMinMax, options) {
      var klass = options.klass || 'bar';
       if (klass == "regionBar")
         var otherData = svg.selectAll(".sampleBar").data();
      else
         var otherData = svg.selectAll(".regionBar").data();
      
      if (options.noOutliers) {
         var q1 = d3.quantile(values,0.25); 
         var q3 = d3.quantile(values,0.75);
         var iqr = (q3-q1) * 1.5; //
         var minMax = [ Math.max(q1-iqr,0), q3+iqr ];
      } else {
         if (otherMinMax != undefined)
            var minMax = d3.extent(values.concat(otherMinMax));
         else
            var minMax = d3.extent(values);
         
      }
      var numBins = 20;
      if (options != undefined) {
         minMax = options.minMax || minMax;
         numBins = options.numBins || numBins;
      }
      x.domain( d3.extent(minMax.concat($.map(otherData, function(d) { return d.x; }))) );
      if(x.domain()[0] == x.domain()[1])
         x.domain([ x.domain()[0] - 10, x.domain()[1] + 10 ]);
      
      var data = d3.layout.histogram()
          .bins(x.ticks(numBins))
          (values);     
     
      var y = d3.scale.linear()
          .domain([0, d3.max(data.concat(otherData), function(d) { return d.y; })])
          .range([height, 0]);
          
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
      
      // handle new data
      var bar = svg.selectAll("." + klass)
          .data(data);
        
      var barEnter = bar.enter().append("g")
         .attr("class", klass + " bar")
         .attr("transform", function(d) { return "translate(" + x(d.x) + "," +  parseInt(y(d.y) + (height-y(d.y))) + ")"; });
          
      // enter
      if (klass == "sampleBar") {
         barEnter.append("rect")
            .attr("x", 1)
            .attr("width", (x(x.domain()[0] + data[0].dx) - 1) / 2 -1)
            .attr("height", 0);

      } else if (klass == "regionBar") {
         barEnter.append("rect")
            .attr("x", (x(x.domain()[0] + data[0].dx) - 1) / 2 + 1)
            .attr("width", (x(x.domain()[0] + data[0].dx) - 1) / 2 -1)
            .attr("height", 0);
      } else {
         alert('no class no class');
      }

      // barEnter.append("text")
      //    .attr("dy", ".75em")
      //    .attr("y", 6)
      //    .attr("x", x(x.domain()[0] + data[0].dx) / 2)
      //    .attr("text-anchor", "middle")
      //    .text(function(d) { return formatCount(d.y); });
      

      // update
      var allbar = svg.selectAll(".bar")
      allbar.transition()
         .duration(200)
         .attr("transform", function(d) { 
            if (x(d.x) < 0) {
               alert('huh?')
            }
            return "translate(" + x(d.x) + "," + Math.floor(y(d.y)) + ")"; 
         });

      bar.select("rect").transition()
         .duration(200)
         .attr("width", (x(x.domain()[0] + data[0].dx) - 1)/2)
         .attr("height", function(d) { return Math.ceil(height - y(d.y)); });
         
      svg.selectAll(".regionBar").select("rect").transition()
         .duration(200)
         .attr("x", (x(x.domain()[0] + data[0].dx) - 1)/2)
         .attr("width", (x(x.domain()[0] + data[0].dx) - 1)/2 -1 )
         .attr("height", function(d) { return Math.ceil(height - y(d.y)); });
         
      svg.selectAll(".sampleBar").select("rect").transition()
         .duration(200)
         .attr("x", 1)
         .attr("width", (x(x.domain()[0] + data[0].dx) - 1)/2-1)
         .attr("height", function(d) { return Math.ceil(height - y(d.y)); });
      

      allbar.select("text").transition()
         .duration(200)
         .attr("dy", ".75em")
         .attr("y", -15)
         .attr("x", x(x.domain()[0] + data[0].dx) / 2)
         .attr("text-anchor", "middle")
         .text(function(d) { if(d.y > 0) return formatCount(d.y); });
      
      bar.exit().remove(); 
            
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
   }

   my.width = function(value) {
      if (!arguments.length) return width;
      width = value;
      return my;
   };
   return my;
   
   my.height = function(value) {
      if (!arguments.length) return height;
      height = value;
      return my;
   };   
   
   return my;
}

