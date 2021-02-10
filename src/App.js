import { useState } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import FlowGroupList from "./FlowGroupList";
import LinkAllocationPlot from "./LinkAllocationPlot";
import BandwidthAggregationPlot from "./BandwidthAggregationPlot";
import AllocationLevelTable from "./AllocationLevelTable";
import {
  allocationLevelsFromPaper,
  flowGroup1FromPaper,
  flowGroup2FromPaper,
} from "./paperExamples";
import { maxEstDemand, maxFlowGroups } from "./globals";
// eslint-disable-next-line
import { allTests } from "./tests";
import { makeEmptyFlowGroup } from "./fairShareLogic";

const fgColors = [
  "#6864b8",
  "#62aa7d",
  "#DEA200",
  "#CC33CC",
  "#0061CD",
  "#BC1E46",
];

function App() {
  // allTests();

  const [showLinkAllocation, setShowLinkAllocation] = useState(false);

  /* Currently, the UI does not allow for a way to modify the allocation levels,
  so they are fixed, but the code is designed to be extendible to an arbitrary number */
  // eslint-disable-next-line
  const [allocLevels, updateAllocLevels] = useImmer(
    allocationLevelsFromPaper()
  );
  const [flowGroups, updateFlowGroups] = useImmer([
    flowGroup1FromPaper(),
    flowGroup2FromPaper(),
  ]);

  const handleNumFlowGroups = (isIncrement) => {
    updateFlowGroups((draftFgs) => {
      const idx = draftFgs.length;
      if (isIncrement) {
        if (idx === maxFlowGroups) return;
        draftFgs.push(
          makeEmptyFlowGroup(
            `flowGroup${idx + 1}`,
            fgColors[idx],
            1,
            allocLevels.length
          )
        );
      } else {
        if (idx === 1) return;
        draftFgs.pop();
      }
    });
  };

  const handleEstimatedDemand = (fgIdx, isIncrement) => {
    updateFlowGroups((draftFgs) => {
      const fg = draftFgs[fgIdx];
      if (isIncrement) {
        if (fg.estimatedDemand < maxEstDemand) fg.estimatedDemand += 1;
      } else {
        if (fg.estimatedDemand > 0) fg.estimatedDemand -= 1;
      }
    });
  };

  const handleNumWeightThresholds = (fgIdx, allocLvlIdx, isIncrement) => {
    updateFlowGroups((draftFgs) => {
      const fg = draftFgs[fgIdx];
      const isLastLvl = allocLvlIdx === fg.allocLevels.length - 1;
      const th = fg.allocLevels[allocLvlIdx]; //thresholds
      const n = th.length;

      //remove case
      if (!isIncrement) {
        if (n < 2) return;
        th.pop();
        if (isLastLvl) th[n - 2][0] = Infinity;
        return;
      }

      //add case
      if (n === 0) {
        th.push([isLastLvl ? Infinity : 0, 0]);
      } else {
        const [lastBw, lastW] = th[n - 1];
        th.push([lastBw, lastW]);
        if (isLastLvl) {
          //only the last bw should be infinite
          th[n - 1][0] = n === 1 ? 0 : th[n - 2][0];
        }
      }
    });
  };

  const handleWeightThreshold = (
    fgIdx,
    allocLvlIdx,
    weightThresholdIdx,
    isWeight,
    isIncrement
  ) => {
    updateFlowGroups((draftFgs) => {
      const fg = draftFgs[fgIdx];
      const th = fg.allocLevels[allocLvlIdx][weightThresholdIdx];
      if (isIncrement) {
        if (isWeight) th[1] += 1;
        else th[0] += 1;
      } else {
        if (isWeight) th[1] -= 1;
        else th[0] -= 1;
      }
    });
  };

  /* flow group configuration tables and bandwidth functions to the left,
  bandwidth function aggregation to the right */
  const mainDivStyle = {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto auto",
    columnGap: "20px",
    justifyItems: "start",
    alignItems: "center",
    justifyContent: "start",
    marginLeft: "15px",
    marginTop: "15px",
  };

  //allocation level table on top, list of flow group tables/bandwidth functions below
  const flowGroupDivStyle = {
    display: "grid",
    gridTemplateRows: "auto auto",
    gridTemplateColumns: "auto",
    rowGap: "20px",
    justifyItems: "center",
    alignItems: "center",
    justifyContent: "center",
  };

  //header on top, main plot below
  const bigPlotStyle = flowGroupDivStyle;

  return (
    <div style={mainDivStyle}>
      <div style={flowGroupDivStyle}>
        <AllocationLevelTable allocLevels={allocLevels} />
        <FlowGroupList
          flowGroups={flowGroups}
          allocLevels={allocLevels}
          handleEstDemand={handleEstimatedDemand}
          handleNumWeightThresholds={handleNumWeightThresholds}
          handleWeightThreshold={handleWeightThreshold}
          handleNumFlowGroups={handleNumFlowGroups}
        />
      </div>
      <div style={bigPlotStyle}>
        <div>
          <span style={{ fontSize: "20px" }}>Show Link Allocation</span>
          <input
            style={{ fontSize: "24px" }}
            name="showLinkAlloc"
            type="checkbox"
            checked={showLinkAllocation}
            onChange={() => {
              setShowLinkAllocation(!showLinkAllocation);
            }}
          />
        </div>
        <div style={{ fontSize: "24px" }}>
          {showLinkAllocation ? "Link allocation" : "Bandwidth Aggregation"}
        </div>
        {showLinkAllocation && (
          <LinkAllocationPlot
            flowGroups={flowGroups}
            allocLevels={allocLevels}
          />
        )}
        {!showLinkAllocation && (
          <BandwidthAggregationPlot
            flowGroups={flowGroups}
            allocLevels={allocLevels}
          />
        )}
      </div>
    </div>
  );
}

export default App;
