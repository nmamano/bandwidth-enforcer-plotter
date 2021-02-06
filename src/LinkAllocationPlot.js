import React from "react";
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { plotBwCutoff, plotBaseMaxFairShare, fairShareColor } from "./globals";
import {
  bandwidthFunctionDataPoints,
  linkFairShareDataPoints,
  allocatedBandwidthDataPoints,
} from "./fairShareLogic";

const defaultPlotLinkCap = 40;

/*
X-axis: link capacity
left Y-axis: allocated bandwidth
right Y-axis: fair share
*/
function LinkAllocationPlot({ flowGroups, allocLevels }) {
  const bwFunctions = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  const fsPts = linkFairShareDataPoints(bwFunctions);
  const plotMaxFs = fsPts.reduce(
    (accum, [cap, fs]) => (fs === Infinity ? accum : Math.max(accum, fs + 1)),
    plotBaseMaxFairShare
  );
  const fairShareData = fsPts.map(([cap, fs], idx) => {
    const prevCap = idx === 0 ? 0 : fsPts[idx - 1][0];
    return fs === Infinity
      ? { fs: plotMaxFs, cap: prevCap }
      : { fs: fs, cap: cap };
  });
  const totalNeededLinkCap = flowGroups.reduce(
    (accum, fg) => accum + fg.estimatedDemand,
    0
  );
  const plotMaxCap = Math.max(totalNeededLinkCap + 5, defaultPlotLinkCap);
  const allocatedBwPts = allocatedBandwidthDataPoints(bwFunctions).map(
    (allocBwPts) => {
      return allocBwPts.map(([availableBw, allocatedBw]) => {
        return availableBw === Infinity
          ? { cap: plotMaxCap, allocBw: allocatedBw }
          : { cap: availableBw, allocBw: allocatedBw };
      });
    }
  );

  const availableBwTicks = [];
  const availableBwTickStep = 2.5;
  for (let i = 0; i <= plotMaxCap; i += availableBwTickStep) {
    availableBwTicks.push(i);
  }
  const fsTicks = [];
  const fsTickStep = 0.5;
  for (let i = 0; i <= plotMaxFs; i += fsTickStep) {
    fsTicks.push(i);
  }
  const allocatedBwTicks = [];
  const allocatedBwTickStep = 2.5;
  for (let i = 0; i <= plotBwCutoff; i += allocatedBwTickStep) {
    allocatedBwTicks.push(i);
  }

  return (
    <ScatterChart
      width={644}
      height={390}
      name={`Available vs allocated bandwidth`}
      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
    >
      <CartesianGrid />
      <XAxis
        type="number"
        dataKey="cap"
        domain={[0, plotMaxCap]}
        label={{ value: "Link Capacity", position: "insideBottom" }}
        height={40}
        name="Link Capacity"
        ticks={availableBwTicks}
        minTickGap={2}
      />
      <YAxis
        type="number"
        dataKey="allocBw"
        domain={[0, plotMaxFs]}
        name="Allocated Bandwidth"
        label={{
          value: "Allocated Bandwidth",
          position: "insideLeft",
          style: { textAnchor: "middle" },
          angle: -90,
        }}
        width={50}
        ticks={allocatedBwTicks}
        orientation={"left"}
        minTickGap={0}
        interval={0}
        yAxisId="left"
      />
      <YAxis
        type="number"
        dataKey="fs"
        domain={[0, plotMaxFs]}
        name="Fair Share"
        label={{
          value: "Fair Share",
          position: "insideRight",
          style: { textAnchor: "middle" },
          angle: -90,
        }}
        width={50}
        ticks={fsTicks}
        orientation={"right"}
        minTickGap={0}
        interval={0}
        yAxisId="right"
      />
      <Tooltip />
      {/* <Legend /> */}
      <Scatter
        name="Fair Share"
        data={fairShareData}
        fill={fairShareColor}
        line={{ strokeWidth: 2 }}
        shape="cross"
        yAxisId="right"
      />
      {allocatedBwPts.map((allocBwPoints, idx) => {
        return (
          <Scatter
            key={`ab${idx}`}
            name="Allocated Bandwidth"
            data={allocBwPoints}
            fill={flowGroups[idx].color}
            line={{ strokeWidth: 2.5 }}
            yAxisId="left"
          />
        );
      })}
      {flowGroups.map((fg, idx) => {
        return (
          <ReferenceLine
            key={`ed${idx}`}
            y={fg.estimatedDemand}
            yAxisId="left"
            label={{
              value: "Est. demand",
              fill: fg.color,
              position: "insideBottomLeft",
            }}
            stroke={fg.color}
            strokeDasharray="3 3"
            strokeWidth={0.8}
            isFront={true}
          />
        );
      })}
      {allocLevels.map((allocLvl, idx) => {
        return (
          <ReferenceLine
            key={`alloc${idx}`}
            y={allocLvl.maxFairShare}
            yAxisId="right"
            stroke={fairShareColor}
            label={{
              value: allocLvl.name + " alloc.",
              position: "insideTopRight",
              fill: fairShareColor,
            }}
            strokeDasharray="3 3"
            strokeWidth={0.8}
          />
        );
      })}
    </ScatterChart>
  );
}

export default LinkAllocationPlot;
