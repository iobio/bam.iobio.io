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
    if (!arguments.length) return pos;
    pos = _;
    return layout;
  };

  /*
   * Specifies the value function *depth*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return depth`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.depth = function(_) {
    if (!arguments.length) return depth;
    depth = _;
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
