import React from "react";

function AllocationLevelTable({ allocLevels }) {
  //init data
  const headers = ["Allocation Level", "Fair Share"];
  const entries = [];
  for (let i = 0; i < allocLevels.length; i++) {
    entries.push(allocLevels[i].name);
    const prevFs = i === 0 ? 0 : allocLevels[i - 1].maxFairShare;
    const fs = allocLevels[i].maxFairShare;
    entries.push(`${prevFs}-${fs === Infinity ? "\u221E" : fs}`);
  }

  //formatting
  const borderStyle = "2px solid black";
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
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${allocLevels.length + 1}, 1fr)`,
          gridTemplateColumns: "auto auto",
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

export default AllocationLevelTable;
