import React from "react";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import {
  maxEstDemand,
  weightLimit,
  bandwidthLimit,
  maxNumWeightThresholds,
} from "./globals";
import { thresholdChangeViolatesFairShareSpan } from "./fairShareLogic";

import IncrementableButton from "./IncrementableButton";

function FlowConfigTable({
  flowGroup,
  allocLevels,
  handleEstDemand,
  handleNumWeightThresholds,
  handleWeightThreshold,
}) {
  const totalWidth = 320;
  const buttonWidth = 90;

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

  const allocLvlDivStyle = { ...cellStyle };
  allocLvlDivStyle.display = "grid";
  allocLvlDivStyle.gridTemplateRows = "auto";
  allocLvlDivStyle.gridTemplateColumns = "1fr 20px 20px";
  allocLvlDivStyle.alignItems = "center";
  const allocTextDivStyle = { justifySelf: "start" };
  const weightThresholdButtonStyle = {
    cursor: "pointer",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    fontSize: "18px",
    paddingTop: "0.2rem",
  };

  const topHeader = `${flowGroup.name}`;
  const topHeaderDiv = <div style={topHeaderStyle}>{topHeader}</div>;

  const estBwDiv = <div style={headerStyle}>Est. Bandwidth</div>;
  const estBwButton = (
    <IncrementableButton
      value={flowGroup.estimatedDemand}
      min={0}
      max={maxEstDemand}
      onInc={() => {
        handleEstDemand(true);
      }}
      onDec={() => {
        handleEstDemand(false);
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
    const addWeightThresholdButton = (
      <div
        style={weightThresholdButtonStyle}
        onClick={() => handleNumWeightThresholds(i, true)}
      >
        <IoIosAddCircleOutline />
      </div>
    );
    const removeWeightThesholdButton = (
      <div
        style={weightThresholdButtonStyle}
        onClick={() => handleNumWeightThresholds(i, false)}
      >
        <IoIosCloseCircleOutline />
      </div>
    );
    for (let j = 0; j < flowGroup.allocLevels[i].length; j++) {
      const isFirst = j === 0;
      const isLast = j === flowGroup.allocLevels[i].length - 1;
      const removeButtonHere = isLast && !isFirst;
      const addButtonHere = isLast && j < maxNumWeightThresholds;
      const [bw, weight] = flowGroup.allocLevels[i][j];
      const allocLvlText = isFirst ? allocLevels[i].name : "";
      const divStyle = { ...allocLvlDivStyle };
      if (!isLast) {
        divStyle.borderBottom = undefined;
      } else {
        divStyle.borderBottom = thickBorderStyle;
      }
      const allocLvlDiv = (
        <div key={`a${i}_${j}`} style={divStyle}>
          <div style={allocTextDivStyle}>{allocLvlText}</div>
          {removeButtonHere ? removeWeightThesholdButton : <div></div>}
          {addButtonHere ? addWeightThresholdButton : <div></div>}
        </div>
      );
      const maxW = isFirst ? weightLimit : flowGroup.allocLevels[i][j - 1][1];
      const minW = isLast ? 0 : flowGroup.allocLevels[i][j + 1][1];
      const weightButton = (
        <IncrementableButton
          key={`w${i}_${j}`}
          value={weight}
          min={minW}
          max={maxW}
          onInc={() => {
            handleWeightThreshold(i, j, true, true);
          }}
          onDec={() => {
            handleWeightThreshold(i, j, true, false);
          }}
          disabledInc={thresholdChangeViolatesFairShareSpan(
            flowGroup,
            allocLevels,
            i,
            j,
            true,
            true
          )}
          disabledDec={thresholdChangeViolatesFairShareSpan(
            flowGroup,
            allocLevels,
            i,
            j,
            true,
            false
          )}
          width={buttonWidth}
          thickBottom={isLast}
        />
      );
      const maxBw = isLast
        ? bandwidthLimit
        : flowGroup.allocLevels[i][j + 1][0];
      const minBw = isFirst ? 0 : flowGroup.allocLevels[i][j - 1][0];
      const bwButton = (
        <IncrementableButton
          key={`b${i}_${j}`}
          value={bw}
          text={
            <span>
              <span style={{ color: "gray" }}>{`${minBw}-`}</span>
              <span>{`${bw === Infinity ? "\u221E" : bw}`}</span>
            </span>
          }
          min={minBw}
          max={maxBw}
          onInc={() => {
            handleWeightThreshold(i, j, false, true);
          }}
          onDec={() => {
            handleWeightThreshold(i, j, false, false);
          }}
          disabled={bw === Infinity || weight === 0}
          disabledInc={thresholdChangeViolatesFairShareSpan(
            flowGroup,
            allocLevels,
            i,
            j,
            false,
            true
          )}
          disabledDec={thresholdChangeViolatesFairShareSpan(
            flowGroup,
            allocLevels,
            i,
            j,
            false,
            false
          )}
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
