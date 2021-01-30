//returns the data points as [fair share, bandwidth] pairs
export const bandwidthFunctionDataPoints = (flowGroup, allocLevels) => {
  const res = [];
  let [curFs, curBw] = [0, 0];
  const fgConfig = flowGroup.allocLevels;
  for (let i = 0; i < allocLevels.length; i++) {
    if (
      i === 0 ||
      curFs !== res[res.length - 1][0] ||
      curBw !== res[res.length - 1][1]
    )
      res.push([curFs, curBw]);
    let prevThreshold = 0;
    for (let j = 0; j < fgConfig[i].length; j++) {
      let [threshold, weight] = fgConfig[i][j];
      let bwIncrement = Math.min(
        threshold - prevThreshold,
        flowGroup.estimatedDemand - curBw
      );
      prevThreshold = threshold;
      if (weight > 0) {
        curFs += bwIncrement / weight;
        curBw += bwIncrement;
        if (
          curFs !== res[res.length - 1][0] ||
          curBw !== res[res.length - 1][1]
        )
          res.push([curFs, curBw]);
      }
    }
    curFs = allocLevels[i].maxFairShare;
  }
  res.push([Infinity, flowGroup.estimatedDemand]);
  return res;
};

const linearInterpolationY = (x, [x0, y0], [x1, y1]) => {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

//could be optimized with binary search
const allocatedBandwidth = (bwFunc, fairShare) => {
  let i = 0;

  //does not go out of bounds because the last fair share is infinite
  while (bwFunc[i][0] < fairShare) i++;

  if (bwFunc[i][0] === fairShare) return bwFunc[i][1];
  if (bwFunc[i][0] === Infinity) return bwFunc[i][1]; //bw function is always flat in last segment
  return linearInterpolationY(fairShare, bwFunc[i - 1], bwFunc[i]);
};
const totalAllocatedBandwidth = (bwFunctions, fairShare) => {
  let res = 0;
  for (let i = 0; i < bwFunctions.length; i++) {
    res += allocatedBandwidth(bwFunctions[i], fairShare);
  }
  return res;
};

const fairShareValues = (bwFuncs) => {
  let res = new Set();
  for (let i = 0; i < bwFuncs.length; i++) {
    for (let j = 0; j < bwFuncs[i].length; j++) {
      res.add(bwFuncs[i][j][0]);
    }
  }
  res = Array.from(res);
  res.sort();
  return res;
};

//returns the data points as [link cap, fair share] pairs
export const linkFairShareDataPoints = (flowGroups, allocLevels) => {
  const bwFuncs = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  let fsValues = fairShareValues(bwFuncs);
  const res = [];
  for (let i = 0; i < fsValues.length; i++) {
    const fs = fsValues[i];
    const linkCap = totalAllocatedBandwidth(bwFuncs, fs);
    res.push([linkCap, fs]);
  }
  return res;
};

//returns the data points as [link cap, allocated bw] pairs for each flow group
export const allocatedBandwidthDataPoints = (flowGroups, allocLevels) => {
  const bwFuncs = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  const linkCapFsPairs = linkFairShareDataPoints(flowGroups, allocLevels);
  let fsValues = fairShareValues(bwFuncs);
  let linkCapValues = [];
  for (let i = 0; i < linkCapFsPairs.length; i++) {
    const [linkCap, fs] = linkCapFsPairs[i];
    if (i === 0 || fs !== linkCapFsPairs[i - 1][1]) {
      linkCapValues.push(linkCap);
    }
  }
  const res = [];
  for (let i = 0; i < bwFuncs.length; i++) {
    const allocBwValues = [];
    for (let j = 0; j < fsValues.length; j++) {
      const linkCap = linkCapValues[j];
      if (j === 0 || linkCap !== linkCapValues[j - 1]) {
        allocBwValues.push([
          linkCap,
          allocatedBandwidth(bwFuncs[i], fsValues[j]),
        ]);
      }
    }
    allocBwValues.push([Infinity, allocBwValues[allocBwValues.length - 1][1]]);
    res.push(allocBwValues);
  }
  return res;
};
