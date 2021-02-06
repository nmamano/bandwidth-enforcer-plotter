import {
  flowGroup1FromPaper,
  flowGroup2FromPaper,
  allocationLevelsFromPaper,
} from "./paperExamples";
import {
  bandwidthFunctionDataPoints,
  linkFairShareDataPoints,
  allocatedBandwidthDataPoints,
} from "./fairShareLogic";

//Figure 3(a) as pairs [fair share, bandwidth]
const paperFg1BandwidthFunction = [
  [0, 0],
  [2, 0],
  [2.5, 10],
  [3.5, 15],
  [Infinity, 15],
];

//Figure 3(b) as pairs [fair share, bandwidth]
const paperFg2BandwidthFunction = [
  [0, 0],
  [1, 10],
  [2, 10],
  [3, 20],
  [Infinity, 20],
];

//pink line in figure 4 as pairs [available bw, fair share]
const paperLinkFairShare = [
  [0, 0],
  [10, 1],
  [10, 2],
  [25, 2.5],
  [32.5, 3],
  [35, 3.5],
  [35, Infinity],
];

//figure 4 (fg1) as pairs [available bw, allocated bw]
const paperAllocatedBwF1 = [
  [0, 0],
  [10, 0],
  [25, 10],
  [32.5, 12.5],
  [35, 15],
  [Infinity, 15],
];

//figure 4 (fg2) as pairs [available bw, allocated bw]
const paperAllocatedBwF2 = [
  [0, 0],
  [10, 10],
  [25, 15],
  [32.5, 20],
  [Infinity, 20],
];

const testBandwidthFunctions = () => {
  console.log("Test: bandwidth functions");
  const allocLevels = allocationLevelsFromPaper();
  const fgs = [flowGroup1FromPaper(), flowGroup2FromPaper()];
  const correctBwFuncs = [paperFg1BandwidthFunction, paperFg2BandwidthFunction];
  for (let i = 0; i < 2; i += 1) {
    const fg = fgs[i];
    const correctBwFunc = JSON.stringify(correctBwFuncs[i]);
    const actualBwFunc = JSON.stringify(
      bandwidthFunctionDataPoints(fg, allocLevels)
    );
    if (correctBwFunc === actualBwFunc) {
      console.log(fg.name + " ok");
    } else {
      console.log(fg.name);
      console.log("Act: " + actualBwFunc);
      console.log("Cor: " + correctBwFunc);
    }
    console.log();
  }
};

const testLinkFairShare = () => {
  console.log("Test: allocated bandwidth");
  const allocLevels = allocationLevelsFromPaper();
  const fgs = [flowGroup1FromPaper(), flowGroup2FromPaper()];
  const bwFunctions = fgs.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  const correctFs = JSON.stringify(paperLinkFairShare);
  const actualFs = JSON.stringify(linkFairShareDataPoints(bwFunctions));
  if (correctFs === actualFs) {
    console.log("fair share ok");
  } else {
    console.log("fair share");
    console.log("Act: " + actualFs);
    console.log("Cor: " + correctFs);
  }
  console.log();

  const correctAllocBws = [
    JSON.stringify(paperAllocatedBwF1),
    JSON.stringify(paperAllocatedBwF2),
  ];
  const actualAllocBws = allocatedBandwidthDataPoints(bwFunctions).map((L) =>
    JSON.stringify(L)
  );
  for (let i = 0; i < 2; i += 1) {
    const fg = fgs[i];
    const correctAllocBw = correctAllocBws[i];
    const actualBwFunc = actualAllocBws[i];
    if (correctAllocBw === actualBwFunc) {
      console.log(fg.name + " ok");
    } else {
      console.log(fg.name);
      console.log("Act: " + actualBwFunc);
      console.log("Cor: " + correctAllocBw);
    }
    console.log();
  }
};

export const allTests = () => {
  console.log("**************************************");
  testBandwidthFunctions();
  testLinkFairShare();
};
