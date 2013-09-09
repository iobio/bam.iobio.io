function donutD3() {
   var radius = 90;
   var klass = 'arc';

   var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 17);
   
   

   function my(selection, c) {
      // c = c || "rgb(45,143,193)";
      // var calpha = c.replace(")", ",0.2)").replace("rgb", "rgba");
      var g = selection.enter().append("g")
         .attr("class", klass)
         .attr("transform", "translate(100,80)");

      g.append("path")
         .attr("d", arc)
         .attr("class", function(d,i) { if(i==1) return "alpha"; return "fill" });
         // .style("fill", function(d,i) { if(i==1) return calpha; return c });
         
      selection.exit().remove();
      if (klass == "regionArc") {
         g.append("text")
            .attr("dy", "-.1em")
            .style("text-anchor", "middle")
            .attr("class", "regionColor")
            .text(function(d,i) { if(i==0) return d.data.number; });
      } else {
         g.append("text")
            .attr("dy", "1.1em")
            .style("font-size", ".65em")
            .style("text-anchor", "middle")
            .attr("class", "sampleColor")
            .text(function(d,i) { if(i==0) return d.data.number; });
      }
         
      selection.select("path")
         .attr("d", arc)
      

      selection.select("text")
         .text(function(d,i) { 
            if(i==0) return d.data.number; 
         });
      
   }

   my.radius = function(value) {
      if (!arguments.length) return radius;
      radius = value;
      arc = d3.svg.arc()
         .outerRadius(radius - 10)
         .innerRadius(radius - 17);
      return my;
   };
   
   my.klass = function(value) {
      if (!arguments.length) return klass;
      klass = value;
      return my;
   };
   
   return my;
}

