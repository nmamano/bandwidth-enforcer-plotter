import React from "react";
import BandwidthPlot from "./BandwidthPlot";
import FlowConfigTable from "./FlowConfigTable";

function FlowGroupList({ flowGroups, allocLevels, handleModifyEstDemand }) {
  return (
    <div>
      {flowGroups.map((fg, idx) => {
        return (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateRows: "1fr",
              gridTemplateColumns: "auto auto",
              columnGap: "5px",
              justifyItems: "start", //horizontal
              alignItems: "center", //vertical
              justifyContent: "start",
            }}
          >
            <FlowConfigTable flowGroup={fg} allocLevels={allocLevels} handleModifyEstDemand={(inc) => handleModifyEstDemand(idx, inc)} />
            <BandwidthPlot flowGroup={fg} allocLevels={allocLevels} />
          </div>
        );
      })}
    </div>
  );
}

export default FlowGroupList;
