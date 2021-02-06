import React, { useState } from "react";

function IncrementableButton({
  value,
  text,
  min,
  max,
  onDec,
  onInc,
  width,
  thickBottom,
  thickRight,
  disabled,
  disabledInc,
  disabledDec,
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

  const buttonBgCol = "#e5e5e5";
  const hoveredBgCol = "#d0d0d0";
  const valueBgCol = "#f6f6f6";
  const disabledButtonBgCol = "#fafafa";
  const disabledButtonTextCol = "#a5a5a5";

  const incDisabled = disabled || disabledInc || value + 1 > max;
  const decDisabled = disabled || disabledDec || value - 1 < min;

  return (
    <div style={style}>
      <div
        style={{
          borderRight: borderStyle,
          color: decDisabled ? disabledButtonTextCol : "black",
          backgroundColor: decDisabled
            ? disabledButtonBgCol
            : hoveredMin
            ? hoveredBgCol
            : buttonBgCol,
          cursor: decDisabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={() => setHoveredMin(true)}
        onMouseLeave={() => setHoveredMin(false)}
        onClick={() => {
          if (!decDisabled) onDec();
        }}
      >
        -
      </div>
      <div
        style={{
          backgroundColor: valueBgCol,
          alignItems: "stretch",
          padding: "0.2em",
        }}
      >
        {text ? text : value === Infinity ? "\u221E" : value}
      </div>
      <div
        style={{
          borderLeft: borderStyle,
          borderRight: thickRight ? thickBorderStyle : borderStyle,
          color: incDisabled ? disabledButtonTextCol : "black",
          backgroundColor: incDisabled
            ? disabledButtonBgCol
            : hoveredMax
            ? hoveredBgCol
            : buttonBgCol,
          cursor: incDisabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={() => setHoveredMax(true)}
        onMouseLeave={() => setHoveredMax(false)}
        onClick={() => {
          if (!incDisabled) onInc();
        }}
      >
        +
      </div>
    </div>
  );
}

export default IncrementableButton;
