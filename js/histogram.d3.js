function histogramD3(container) {
   var margin = {top: 20, right: 30, bottom: 30, left: 30},
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
         var q1 = d3.quantile(values,0.25); 
         var q3 = d3.quantile(values,0.75);
         var iqr = (q3-q1) * 1.5; //
         var minMax = [ Math.max(q1-iqr,0), q3+iqr ];
      } else {
         var minMax = d3.extent(values);
      }
      
      x.domain(minMax);
      // check for single value histogram
      if(x.domain()[0] == x.domain()[1])
            x.domain([ x.domain()[0] - 10, x.domain()[1] + 10 ]);
                  
      // var brush = d3.svg.brush()
      //     .x(x)
      //     .on("brush", brushed);
      // var arc = d3.svg.arc()
      //    .outerRadius(height / 2)
      //    .startAngle(0)
      //    .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
      
      var data = d3.layout.histogram()
          .bins(x.ticks(numBins))
          (values);

      var y = d3.scale.linear()
          .domain([0, d3.max(data, function(d) { return d.y; })])
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

      var bar = svg.selectAll(".bar")
          .data(data)
        .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + height + ")"; });

      bar.append("rect")
          .attr("x", 1)
          .attr("width", x(x.domain()[0] + data[0].dx) - 1)
          .attr("height", function(d) { return 0; });
          
      // update
      bar = svg.selectAll('.bar');
      bar.transition()
         .duration(200)
         .attr("transform", function(d) { return "translate(" + x(d.x) + "," + Math.floor(y(d.y)) + ")"; });
         
      bar.select("rect").transition()
         .duration(200)
         .attr("width", (x(x.domain()[0] + data[0].dx) - 1))
         .attr("height", function(d) { return Math.ceil(height - y(d.y)); });
      
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