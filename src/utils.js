//given a list of 2+ points [x,y], remove duplicated points anad points aligned with the previous and next points
//points are assumed ordered such that each point is larger in at least one of the coordinates than the previous
//last point can have Infinity as coordinates
export const removeFlatPoints = (points) => {
  const P = []; //unique points
  P.push(points[0]);
  for (let i = 1; i < points.length; i += 1) {
    if (points[i][0] === points[i - 1][0] && points[i][1] === points[i - 1][1])
      continue; //repeated point
    P.push(points[i]);
  }
  const res = [];
  res.push(P[0]);
  for (let i = 1; i < P.length - 1; i += 1) {
    if (P[i - 1][0] === P[i + 1][0]) continue; //middle of vertical segment
    if (P[i - 1][0] === P[i][0] || P[i][0] === P[i + 1][0]) {
      //start or end of vertical segment
      res.push(P[i]);
      continue;
    }
    const slope1 = (P[i][1] - P[i - 1][1]) / (P[i][0] - P[i - 1][0]);
    if (P[i + 1][0] === Infinity) {
      if (slope1 !== 0) res.push(P[i]);
    } else if (P[i + 1][1] === Infinity) {
      res.push(P[i]);
    } else {
      const slope2 = (P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]);
      //handle floating point precission errors
      if (Math.abs(slope1 - slope2) > 0.0000001) {
        res.push(P[i]);
      }
    }
  }
  res.push(P[P.length - 1]);
  return res;
};

export const linearInterpolationY = (x, [x0, y0], [x1, y1]) => {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};
