import { removeFlatPoints, linearInterpolationY } from "./utils";

/*A flow group has a name, an estimated demand, an (arbitrary) display color,
and, most importantly, the bandwidth requirements for each allocation level:
For each allocation level, there is a list of weight thresholds.
Each weight threshold is a pair of values [bandwidth, weight].
* If the flow group requires no bandwidth in an allocation level, there should be a single pair [0,0].
* Otherwise, it should contain 1+ pairs where:
-- bandwidth values (meaning cumulative bandwidth for that allocation level) must be increasing
-- weight values must be decreasing
In addition, the last requirement for the last (least prioritary) allocation level
should be infinite, since the estimated demand of the flow group is what should
ultimately limit how much bandwidth can be allocated to a flow group.

The bandwidth requested for each allocation level must be completely allocatable
by the point fair share reaches the transition to the next allocation level.
For now, the slope of bandwidth functions is equal to the weight, so a bandwidth
function could be invalid if the required bandwidth is too high (equivalently, if the weight is too low)
For example, 2.5 bandwidth with weight 1 would be too much for an allocation level with a range of 0-2 fair share.
(the alternative would be to make the slope a multiple of the weight that changes automatically
but, for the sake of visualization, I think weight=slope is more useful)
*/

/* Makes a flow group with no bandwidth requirements 
(except the bandwidth for the last (least prioritary) allocation level, which is infinite) */
export const makeEmptyFlowGroup = (name, color, estBandwidth, numAllocLvls) => {
  const allocLvls = [];
  for (let i = 0; i < numAllocLvls - 1; i++) allocLvls[i] = [[0, 0]];
  allocLvls.push([[Infinity, 0]]);
  return {
    name: name,
    color: color,
    estimatedDemand: estBandwidth,
    allocLevels: allocLvls,
  };
};

/* given the requirements for a flow group and the transition points between allocation 
levels, returns the bandwidth function (as defined in the paper) for the flow group
The bandwidth function is returned as an ordered list of points [fair share, bandwidth],
where the last point has infinite fair share */
export const bandwidthFunctionDataPoints = (flowGroup, allocLevels) => {
  const res = [];
  let [accumFs, accumBw] = [0, 0];
  const fgConfig = flowGroup.allocLevels;
  for (let i = 0; i < allocLevels.length; i++) {
    res.push([accumFs, accumBw]);
    let prevBw = 0; //bw starts at 0 for each alloc level
    for (let j = 0; j < fgConfig[i].length; j++) {
      let [bw, weight] = fgConfig[i][j];
      let bwIncrement = Math.min(
        bw - prevBw,
        flowGroup.estimatedDemand - accumBw //bw functions cannot exceed est. demand
      );
      prevBw = bw;
      if (weight > 0) {
        accumFs += bwIncrement / weight;
        accumBw += bwIncrement;
        res.push([accumFs, accumBw]);
      }
    }
    //regardless of the used fair share, the next allocation level starts at this specific fair share
    accumFs = allocLevels[i].maxFairShare;
  }
  res.push([Infinity, accumBw]);
  return removeFlatPoints(res);
};

/* Given a bandwidth function (ordered list of pairs [fair share, bandwidth]) and a fair share value,
returns the allocated bandwidth at that given fair share value.
As mentioned in the paper, this could easily be optimized with binary search */
const allocatedBandwidth = (bwFunc, fairShare) => {
  if (fairShare === Infinity) return bwFunc[bwFunc.length - 1][1];

  let i = 0;
  //does not go out of bounds because the last fair share is infinite
  while (bwFunc[i][0] < fairShare) i++;

  if (bwFunc[i][0] === fairShare) return bwFunc[i][1];
  if (bwFunc[i][0] === Infinity) return bwFunc[i][1]; //bw function is always flat in last segment
  return linearInterpolationY(fairShare, bwFunc[i - 1], bwFunc[i]);
};

/* Given a list of bandwidth functions and a fair share value, returns the total
allocated bandwidth between the bandwidth functions at that given fair share value. */
const totalAllocatedBandwidth = (bwFunctions, fairShare) => {
  let res = 0;
  for (let i = 0; i < bwFunctions.length; i++) {
    res += allocatedBandwidth(bwFunctions[i], fairShare);
  }
  return res;
};

/* Given a list of bandwidth functions, returns, in order, all the unique fair share values
where one of the functions has a linear-piece endpoint, including Infinity as the last value */
const fairShareValues = (bwFuncs) => {
  const fsValues = new Set();
  for (let i = 0; i < bwFuncs.length; i++) {
    for (let j = 0; j < bwFuncs[i].length; j++) {
      fsValues.add(bwFuncs[i][j][0]);
    }
  }
  const res = Array.from(fsValues);
  res.sort((a, b) => a - b); //sort by value instead of lexicographical order
  console.assert(res[res.length - 1] === Infinity);
  return res;
};

/* Given a list of bandwidth functions, returns the aggregated fair share function
as a function of the available capacity of a link shared by all the flow groups.
The aggregated fair share function is returned as a sorted list of points [link cap, fair share].

The following observation gives us the list of candidate points to consider:
all the linear-piece endpoints of the aggregated fair share function must also be 
a linear-piece endpoint of one of the bandwidth functions. */
export const linkFairShareDataPoints = (bwFunctions) => {
  const fsValues = fairShareValues(bwFunctions);
  const res = fsValues.map((fs) => [
    totalAllocatedBandwidth(bwFunctions, fs),
    fs,
  ]);
  return removeFlatPoints(res);
};

/* Given a list of bandwidth functions, returns the allocated bandwidth function for each
of them as a function of the available capacity of a link shared by all the flow groups.
Each allocated bandwidth function is returned as an ordered list of pairs [link cap, allocated bw] */
export const allocatedBandwidthDataPoints = (bwFuncs) => {
  const linkCapFsPairs = linkFairShareDataPoints(bwFuncs);

  const allocatedBwSingleFg = (bwFunc) => {
    const res = linkCapFsPairs.map(([linkCap, fs]) => [
      linkCap,
      allocatedBandwidth(bwFunc, fs),
    ]);
    //last point: link with infinite cap, the allocated bw is the same as the previous point
    res.push([Infinity, res[res.length - 1][1]]);

    return removeFlatPoints(res);
  };

  return bwFuncs.map((bwFunc) => allocatedBwSingleFg(bwFunc));
};

/* Given the list of weight thresholds for the bandwidth requirements of a flow group
for a specific allocation level, returns the amount of fair share needed by the flow
group to allocate all the required bandwidth in that allocation level.

Assumes that in the bandwidth function, slope = weight, where slope = (required bw / fair share)
in each linear segment, so the total fair share is the sum, over all the segments, of required bandwidth / weight */
const neededFairshare = (thresholds) => {
  //the last allocation level always demands infinite bandwidth, which requires infinite fair share
  if (thresholds[thresholds.length - 1][0] === Infinity) return Infinity;
  let accumFs = 0;
  let prevBw = 0;
  for (let i = 0; i < thresholds.length; i++) {
    let [bw, weight] = thresholds[i];
    let bwIncrement = bw - prevBw;
    prevBw = bw;
    if (weight > 0) {
      accumFs += bwIncrement / weight;
    }
  }
  return accumFs;
};

/* Given a list of allocation levels and an index, returns the span (max - min) of fair share
for the allocation level at that index */
const fairShareSpan = (allocationLevels, allocLvlIdx) => {
  //the last allocation level goes to infinite fair share
  if (allocLvlIdx === allocationLevels.length - 1) return Infinity;
  const allocLvl = allocationLevels[allocLvlIdx];
  if (allocLvlIdx === 0) return allocLvl.maxFairShare;
  return allocLvl.maxFairShare - allocationLevels[allocLvlIdx - 1].maxFairShare;
};

/* As discussed at the top of this file, some bandwidth/weight combinations in a flow group 
configuration are invalid because there would be not enough fair share in an allocation level.
This function checks if increasing or decreasing the bandwidth or weight of a threshold would make
the configuration of a flow group invalid */
export const thresholdChangeViolatesFairShareSpan = (
  flowGroup,
  allocationLevels,
  allocLvlIdx,
  thresholdIdx,
  isWeight,
  isInc
) => {
  //make a (deep) copy of the thresholds in the modified allocation level
  let modifiedThresholdList = flowGroup.allocLevels[allocLvlIdx].map((p) => [
    ...p,
  ]);
  const modifiedIdx = isWeight ? 1 : 0;
  modifiedThresholdList[thresholdIdx][modifiedIdx] += isInc ? 1 : -1;
  return (
    neededFairshare(modifiedThresholdList) >
    fairShareSpan(allocationLevels, allocLvlIdx)
  );
};
