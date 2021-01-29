import React from "react";
import BandwidthPlot from "./BandwidthPlot";
import FlowConfigTable from "./FlowConfigTable";

function FlowGroupList({ flowGroups, allocLevels }) {
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
            <FlowConfigTable flowGroup={fg} allocLevels={allocLevels} />
            <BandwidthPlot flowGroup={fg} allocLevels={allocLevels} />
          </div>
        );
      })}
    </div>
  );
}

export default FlowGroupList;
