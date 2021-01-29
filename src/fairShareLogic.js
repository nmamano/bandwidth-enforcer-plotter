//returns the data points as [fair share, bandwidth] pairs
export const bandwidthFunctionDataPoints = (flowGroup, allocLevels) => {
  const res = [];
  let [curFs, curBw] = [0, 0];
  const fgConfig = flowGroup.allocLevels;
  for (let i = 0; i < allocLevels.length; i++) {
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
        curBw += bwIncrement;
        curFs += bwIncrement / weight;
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

//returns the data points as [available bw, fair share] pairs
export const fairShareDataPoints = (flowGroups, allocLevels) => {
  const bwFuncs = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  let fsValues = fairShareValues(bwFuncs);
  const res = [];
  for (let i = 0; i < fsValues.length; i++) {
    const fs = fsValues[i];
    const allocBw = totalAllocatedBandwidth(bwFuncs, fs);
    res.push([allocBw, fs]);
  }
  return res;
};

//returns the data points as [available bw, allocated bw] pairs
export const allocatedBandwidthDataPoints = (flowGroups, allocLevels) => {
  const bwFuncs = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  const availableBwFsPairs = fairShareDataPoints(flowGroups, allocLevels);
  let fsValues = fairShareValues(bwFuncs);
  let availableBwValues = [];
  for (let i = 0; i < availableBwFsPairs.length; i++) {
    const [availableBw, fs] = availableBwFsPairs[i];
    if (i === 0 || fs !== availableBwFsPairs[i - 1][1]) {
      availableBwValues.push(availableBw);
    }
  }
  const res = [];
  for (let i = 0; i < bwFuncs.length; i++) {
    const allocBwValues = [];
    for (let j = 0; j < fsValues.length; j++) {
      const availBw = availableBwValues[j];
      if (j === 0 || availBw !== availableBwValues[j - 1]) {
        allocBwValues.push([
          availableBwValues[j],
          allocatedBandwidth(bwFuncs[i], fsValues[j]),
        ]);
      }
    }
    allocBwValues.push([Infinity, allocBwValues[allocBwValues.length - 1][1]]);
    res.push(allocBwValues);
  }
  return res;
};
