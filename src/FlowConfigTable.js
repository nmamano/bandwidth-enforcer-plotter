import React from "react";
import { maxEstDemand } from "./globals";
import IncrementableButton from "./IncrementableButton";

function FlowConfigTable({ flowGroup, allocLevels, handleModifyEstDemand }) {
  const borderStyle = "1px solid black";
  const thickBorderStyle = "2px solid black";
  const tableStyle = {
    borderTop: thickBorderStyle,
    borderLeft: thickBorderStyle,
  };
  const cellStyle = {
    borderBottom: borderStyle,
    borderRight: borderStyle,
    textAlign: "center",
    justifySelf: "stretch",
    alignSelf: "stretch",
  };
  const headerStyle = { ...cellStyle };
  headerStyle.fontWeight = "bold";
  headerStyle.padding = "0.2rem";
  headerStyle.borderBottom = thickBorderStyle;
  const topHeaderStyle = { ...headerStyle };
  topHeaderStyle.color = flowGroup.color;
  topHeaderStyle.borderRight = thickBorderStyle;

  const totalWidth = 320;
  const buttonWidth = 90;

  const topHeader = `${flowGroup.name}`;
  const topHeaderDiv = <div style={topHeaderStyle}>{topHeader}</div>;

  const estBwDiv = <div style={headerStyle}>Est. Bandwidth</div>;
  const estBwButton = (
    <IncrementableButton
      value={flowGroup.estimatedDemand}
      min={0}
      max={maxEstDemand}
      onInc={() => {
        handleModifyEstDemand(true);
      }}
      onDec={() => {
        handleModifyEstDemand(false);
      }}
      width={buttonWidth}
      thickBottom
      thickRight
    />
  );
  const estBwRow = (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `1fr`,
        gridTemplateColumns: `1fr ${buttonWidth}px`,
        justifyItems: "stretch",
        alignItems: "stretch",
        justifyContent: "stretch",
        width: `${totalWidth}px`,
      }}
    >
      {estBwDiv}
      {estBwButton}
    </div>
  );

  const headers = ["Allocation level", "Weight", "Bandwidth"];
  const headerDivs = headers.map((text, idx) => {
    const sty = { ...headerStyle };
    if (idx === headers.length - 1) sty.borderRight = thickBorderStyle;
    return (
      <div key={`h${idx}`} style={sty}>
        {text}
      </div>
    );
  });

  const entryDivs = [];
  let rowCount = 1;
  for (let i = 0; i < allocLevels.length; i++) {
    rowCount += flowGroup.allocLevels[i].length;
    for (let j = 0; j < flowGroup.allocLevels[i].length; j++) {
      const [bw, w] = flowGroup.allocLevels[i][j];
      const allocLvl = j === 0 ? allocLevels[i].name : "";
      const allocDivStyle = { ...cellStyle };
      const isLast = j === flowGroup.allocLevels[i].length - 1;
      if (!isLast) {
        allocDivStyle.borderBottom = undefined;
      } else {
        allocDivStyle.borderBottom = thickBorderStyle;
      }
      const allocLvlDiv = (
        <div key={`a${i}_${j}`} style={allocDivStyle}>
          {allocLvl}
        </div>
      );
      const weightButton = (
        <IncrementableButton
          key={`w${i}_${j}`}
          value={w}
          width={buttonWidth}
          thickBottom={isLast}
        />
      );
      const bwButton = (
        <IncrementableButton
          key={`b${i}_${j}`}
          value={bw}
          width={buttonWidth}
          thickBottom={isLast}
          thickRight
        />
      );
      entryDivs.push(allocLvlDiv);
      entryDivs.push(weightButton);
      entryDivs.push(bwButton);
    }
  }
  const entryRows = (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        gridTemplateColumns: `1fr ${buttonWidth}px ${buttonWidth}px`,
        justifyItems: "stretch",
        alignItems: "stretch",
        justifyContent: "stretch",
        width: `${totalWidth}px`,
      }}
    >
      {headerDivs.map((div) => div)}
      {entryDivs.map((div) => div)}
    </div>
  );

  return (
    <div style={tableStyle}>
      {topHeaderDiv}
      {estBwRow}
      {entryRows}
    </div>
  );
}

export default FlowConfigTable;
