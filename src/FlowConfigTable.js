import React from "react";

function FlowConfigTable({ flowGroup, allocLevels }) {
  //init data
  const topHeader = `${flowGroup.name} (${flowGroup.estimatedDemand} est. demand)`;
  const headers = ["Allocation level", "Weight", "Bandwidth"];
  const entries = [];
  for (let i = 0; i < allocLevels.length; i++) {
    for (let j = 0; j < flowGroup.allocLevels[i].length; j++) {
      const [bw, w] = flowGroup.allocLevels[i][j];
      entries.push(j === 0 ? allocLevels[i].name : "");
      entries.push(w);
      entries.push(bw === Infinity ? "\u221E" : bw);
    }
  }

  //formatting (repeated from Allocation Level Table)
  const borderStyle = "1px solid black";
  const tableStyle = {
    borderTop: borderStyle,
    borderLeft: borderStyle,
  };
  const entryStyle = {
    margin: 0,
    padding: "0.2rem",
    borderBottom: borderStyle,
    borderRight: borderStyle,
    textAlign: "center",
    justifySelf: "stretch",
    alignSelf: "stretch",
  };
  const headerStyle = { ...entryStyle };
  headerStyle.fontWeight = "bold";
  const topHeaderStyle = { ...headerStyle };
  topHeaderStyle.color = flowGroup.color;

  const divs = [];
  for (let i = 0; i < headers.length; i += 1) {
    divs.push(
      <div key={`h${i}`} style={headerStyle}>
        {headers[i]}
      </div>
    );
  }
  for (let i = 0; i < entries.length; i += 1) {
    divs.push(
      <div key={`e${i}`} style={entryStyle}>
        {entries[i]}
      </div>
    );
  }

  return (
    <div style={tableStyle}>
      <div style={topHeaderStyle}>{topHeader}</div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${allocLevels.length + 1}, 1fr)`,
          gridTemplateColumns: "auto auto auto",
          columnGap: 0,
          justifyItems: "start", //horizontal
          alignItems: "center", //vertical
          justifyContent: "start",
          margin: 0,
        }}
      >
        {divs.map((div) => div)}
      </div>
    </div>
  );
}

export default FlowConfigTable;
