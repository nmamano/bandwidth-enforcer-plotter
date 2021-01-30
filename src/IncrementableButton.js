import React, { useState } from "react";

function IncrementableButton({
  value,
  min,
  max,
  onDec,
  onInc,
  width,
  thickBottom,
  thickRight,
}) {
  const borderStyle = "1px solid black";
  const thickBorderStyle = "2px solid black";
  const style = {
    borderBottom: thickBottom ? thickBorderStyle : borderStyle,
    borderRight: thickRight ? thickBorderStyle : borderStyle,
    textAlign: "center",
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: `16px ${width - 16 * 2}px 16px`,
    justifyItems: "stretch",
    alignItems: "stretch",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  };
  const [hoveredMin, setHoveredMin] = useState(false);
  const [hoveredMax, setHoveredMax] = useState(false);

  const buttonBgCol = "#f0f0f0";
  const hoveredBgCol = "#e0e0e0";
  const valueBgCol = "#f6f6f6";
  const maxedButtonBgCol = "#fafafa";
  const maxedButtonTextCol = "#a5a5a5";

  return (
    <div style={style}>
      <div
        style={{
          borderRight: borderStyle,
          color: value === min ? maxedButtonTextCol : "black",
          backgroundColor:
            value === min
              ? maxedButtonBgCol
              : hoveredMin
              ? hoveredBgCol
              : buttonBgCol,
          cursor: value === min ? "not-allowed" : "pointer",
        }}
        onMouseEnter={() => setHoveredMin(true)}
        onMouseLeave={() => setHoveredMin(false)}
        onClick={onDec}
      >
        -
      </div>
      <div
        style={{
          backgroundColor: valueBgCol,
        }}
      >
        {value === Infinity ? "\u221E" : value}
      </div>
      <div
        style={{
          borderLeft: borderStyle,
          borderRight: thickRight ? thickBorderStyle : borderStyle,
          color: value === max ? maxedButtonTextCol : "black",
          backgroundColor:
            value === max
              ? maxedButtonBgCol
              : hoveredMax
              ? hoveredBgCol
              : buttonBgCol,
          cursor: value === max ? "not-allowed" : "pointer",
        }}
        onMouseEnter={() => setHoveredMax(true)}
        onMouseLeave={() => setHoveredMax(false)}
        onClick={onInc}
      >
        +
      </div>
    </div>
  );
}

export default IncrementableButton;
