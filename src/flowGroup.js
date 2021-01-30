/*functions to create/manage objects representing flow groups

A flow group has a name, an estimated demand, an (arbitrary) color,
and, most importantly, the bandwidth requirements:
There is a list of bandwidth thresholds for each allocation level:
Each threshold, a pair of values [bandwidth, weight]:
- If the flow group requires no bandwidth in this allocation level,
there should be a single threshold pair [0,0].
- Otherwise, it should contain 1+ pairs where
--- bandwidth values (meaning cumulative bandwidth for that allocation level) 
must be strictly increasing and non-negative.
--- weight values must be strictly decreasing and non-negative
In addition, the last requirement for the last (least prioritary) allocation level
should be infinite, since the estimated demand of the flow group already imposes
a limit to how much bandwidth is allocated to a flow group.

for now, weight is equivalent to the slope in the Bandwidth function,
so the bandwidth requested for each allocation level should be
completely allocatable by the point fair share reaches the transition to the next
allocation level. For example, 2.5 bandwidth with weight 1 would be too much for
an allocation level with a range of 0-2 fair share
*/

/* Makes a flow group that has no name, no estimated demand,
no bandwidth thresholds, and an arbitrary color */
const colors = ["#6864b8", "#62aa7d"];
export const makeEmptyFlowGroup = (numAllocLvls) => {
  //cycle through available colors
  if (makeEmptyFlowGroup.colorIdx === undefined) {
    makeEmptyFlowGroup.colorIdx = 0; //"static" variable
  } else {
    makeEmptyFlowGroup.colorIdx =
      (makeEmptyFlowGroup.colorIdx + 1) % colors.length;
  }
  const allocLvls = [];
  for (let i = 0; i < numAllocLvls - 1; i++) allocLvls[i] = [[0, 0]];
  allocLvls.push([[Infinity, 0]]);
  //bandwidth for the last (least prioritary) allocation level is
  //infinite, since the allocated bandwidth is bounded by
  //the estimated demand
  return {
    name: "",
    color: colors[makeEmptyFlowGroup.colorIdx],
    estimatedDemand: 0,
    allocLevels: allocLvls,
  };
};

//functions to modify a flow group

export const changeFGName = (fg, newName) => {
  fg.name = newName;
};
export const changeFGEstDemand = (fg, newDemand) => {
  fg.estimatedDemand = newDemand;
};
export const addFGThreshold = (fg, allocLvl, newBandwidth, newWeight) => {
  fg.allocLevels[allocLvl].push([newBandwidth, newWeight]);
};
export const changeFGThreshold = (fg, allocLvl, threshold, newBandwidth) => {
  fg.allocLevels[allocLvl][threshold][0] = newBandwidth;
};
export const changeFGWeight = (fg, allocLvl, threshold, newWeight) => {
  fg.allocLevels[allocLvl][threshold][1] = newWeight;
};
