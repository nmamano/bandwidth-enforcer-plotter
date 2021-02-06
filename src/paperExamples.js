//example used in the paper (Table 1, Figures 3-4)
//we use it as default functions for the app
//as well as in unit tests



import { makeEmptyFlowGroup } from "./fairShareLogic";

//allocation levels should be sorted from most prioritary to least
//guaranteed has the range of fair share [0, 2], and best effort has the range [2, +inf]
export const allocationLevelsFromPaper = () => [
  { name: "Guaranteed", maxFairShare: 2 },
  { name: "Best Effort", maxFairShare: Infinity },
];

//specific flow groups from the paper
//they can be used as defaults for the app
//Table 1 (a)
export const flowGroup1FromPaper = () => {
  const fg1 = makeEmptyFlowGroup("flowGroup1", "#6864b8", 15, 2);
  fg1.allocLevels[1][0] = [10, 20];
  fg1.allocLevels[1].push([Infinity, 5]);
  return fg1;
};

//Table 1 (b)
export const flowGroup2FromPaper = () => {
  const fg2 = makeEmptyFlowGroup("flowGroup2", "#62aa7d", 20, 2);
  fg2.allocLevels[0][0] = [10, 10];
  fg2.allocLevels[1][0][1] = 10;
  return fg2;
};
