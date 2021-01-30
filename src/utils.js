//given a list of 2+ points [x,y], remove all the points which are aligned with the previous and next points
//points are ordered such that each point is larger in at least one of the coordinates than the previous
//last point can have Infinity as coordinates
export const removeFlatPoints = (P) => {
  const res = [];
  res.push(P[0]);
  for (let i = 1; i < P.length - 1; i += 1) {
    if (P[i][0] === P[i - 1][0] && P[i][1] === P[i - 1][1]) continue; //repeated point
    if (P[i - 1][0] === P[i + 1][0]) continue; //middle of vertical segment
    if (P[i - 1][0] === P[i][0] || P[i][0] === P[i + 1][0]) {
      //endpoint of vertical segment
      res.push(P[i]);
    }
    const slope1 = (P[i][1] - P[i - 1][1]) / (P[i][0] - P[i - 1][0]);
    let slope2;
    if (P[i + 1][0] === Infinity) slope2 = 0;
    else if (P[i + 1][1] === Infinity) slope2 = Infinity;
    else slope2 = (P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]);
    if (slope1 !== slope2) res.push(P[i]);
  }
  res.push(P[P.length - 1]);
  return res;
};
