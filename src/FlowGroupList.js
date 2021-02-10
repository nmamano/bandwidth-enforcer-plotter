import React from "react";
import BandwidthPlot from "./BandwidthPlot";
import FlowConfigTable from "./FlowConfigTable";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { maxFlowGroups } from "./globals";

function FlowGroupList({
  flowGroups,
  allocLevels,
  handleEstDemand,
  handleNumWeightThresholds,
  handleWeightThreshold,
  handleNumFlowGroups,
}) {
  const addFgButtonStyle = {
    justifySelf: "start",
    cursor: "pointer",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  };
  const removeFgButtonStyle = { ...addFgButtonStyle };
  removeFgButtonStyle.justifySelf = "end";

  const addFgButton = (
    <div style={addFgButtonStyle} onClick={() => handleNumFlowGroups(true)}>
      <IoIosAddCircleOutline />
    </div>
  );
  const removeFgButton = (
    <div style={removeFgButtonStyle} onClick={() => handleNumFlowGroups(false)}>
      <IoIosCloseCircleOutline />
    </div>
  );

  const sideBySideDivStyle = {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto auto",
    columnGap: "10px",
    alignItems: "center",
  };

  return (
    <div>
      {flowGroups.map((fg, fgIdx) => {
        return (
          <div key={fgIdx} style={sideBySideDivStyle}>
            <FlowConfigTable
              flowGroup={fg}
              allocLevels={allocLevels}
              handleEstDemand={(isInc) => handleEstDemand(fgIdx, isInc)}
              handleNumWeightThresholds={(allocLvlIdx, isInc) =>
                handleNumWeightThresholds(fgIdx, allocLvlIdx, isInc)
              }
              handleWeightThreshold={(
                allocLvlIdx,
                weightThresholdIdx,
                isWeight,
                isInc
              ) =>
                handleWeightThreshold(
                  fgIdx,
                  allocLvlIdx,
                  weightThresholdIdx,
                  isWeight,
                  isInc
                )
              }
            />
            <BandwidthPlot flowGroup={fg} allocLevels={allocLevels} />
          </div>
        );
      })}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr 1fr 2fr",
          columnGap: "20px",
          justifyItems: "start",
          alignItems: "center",
          justifyContent: "start",
          fontSize: "24px",
        }}
      >
        {flowGroups.length > 1 ? removeFgButton : <div />}
        {flowGroups.length < maxFlowGroups ? addFgButton : <div />}
        <div />
      </div>
    </div>
  );
}

export default FlowGroupList;
