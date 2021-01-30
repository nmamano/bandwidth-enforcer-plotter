//example used in the paper (Table 1, Figures 3-4)
//we use it as default functions for the app
//as well as in unit tests

import {
  makeEmptyFlowGroup,
  changeFGName,
  changeFGEstDemand,
  changeFGThreshold,
  changeFGWeight,
  addFGThreshold,
} from "./flowGroup";

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
  const fg1 = makeEmptyFlowGroup(2);
  changeFGName(fg1, "fg1");
  changeFGEstDemand(fg1, 15);
  changeFGThreshold(fg1, 1, 0, 10);
  changeFGWeight(fg1, 1, 0, 20);
  addFGThreshold(fg1, 1, Infinity, 5);
  return fg1;
};

//Table 1 (b)
export const flowGroup2FromPaper = () => {
  const fg2 = makeEmptyFlowGroup(2);
  changeFGName(fg2, "fg2");
  changeFGEstDemand(fg2, 20);
  changeFGThreshold(fg2, 0, 0, 10);
  changeFGWeight(fg2, 0, 0, 10);
  changeFGWeight(fg2, 1, 0, 10);
  return fg2;
};
