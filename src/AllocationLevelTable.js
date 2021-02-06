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
    padding: "0.2em",
    borderBottom: borderStyle,
    borderRight: borderStyle,
    textAlign: "center",
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
        }}
      >
        {divs.map((div) => div)}
      </div>
    </div>
  );
}

export default AllocationLevelTable;
