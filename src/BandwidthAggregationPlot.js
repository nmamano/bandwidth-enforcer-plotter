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
import { plotBaseMaxFairShare, fairShareColor } from "./globals";
import {
  bandwidthFunctionDataPoints,
  aggregatedBandwidthFunctionDataPoints,
} from "./fairShareLogic";

const defaultAggrEstDemand = 40;

function BandwidthAggregationPlot({ flowGroups, allocLevels }) {
  const bwFunctions = flowGroups.map((fg) =>
    bandwidthFunctionDataPoints(fg, allocLevels)
  );
  const bwPts = aggregatedBandwidthFunctionDataPoints(bwFunctions); //[fs, bw] pairs
  const plotMaxFs = bwPts.reduce(
    (accum, [fs, bw]) => (fs === Infinity ? accum : Math.max(accum, fs + 1)),
    plotBaseMaxFairShare
  );
  const totalEstDemand = flowGroups.reduce(
    (accum, fg) => accum + fg.estimatedDemand,
    0
  );
  const plotMaxBw = Math.max(totalEstDemand + 5, defaultAggrEstDemand);

  const data = bwPts.map(([fs, bw], idx) => {
    const prevBw = idx === 0 ? 0 : bwPts[idx - 1][1];
    return fs === Infinity ? { fs: plotMaxFs, bw: prevBw } : { fs: fs, bw: bw };
  });

  const bwTicks = [];
  const bwTickStep = 5;
  for (let i = 0; i <= plotMaxBw; i += bwTickStep) {
    bwTicks.push(i);
  }
  const fsTicks = [];
  const fsTickStep = 0.5;
  for (let i = 0; i <= plotMaxFs; i += fsTickStep) {
    fsTicks.push(i);
  }

  return (
    <ScatterChart
      width={644}
      height={390}
      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
    >
      <CartesianGrid />
      {allocLevels.map((allocLvl, idx) => {
        return (
          <ReferenceLine
            key={idx}
            x={allocLvl.maxFairShare}
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
      <XAxis
        type="number"
        dataKey="fs"
        domain={[0, plotMaxFs]}
        label={{ value: "Fair Share", position: "insideBottom" }}
        height={40}
        ticks={fsTicks}
      />
      <YAxis
        type="number"
        dataKey="bw"
        domain={[0, plotMaxBw]}
        label={{
          value: "Allocated Bandwidth",
          position: "insideLeft",
          style: { textAnchor: "middle" },
          angle: -90,
        }}
        width={40}
        ticks={bwTicks}
      />
      <Tooltip />
      <Scatter
        name="Fair Share"
        data={data}
        fill={"black"}
        line={{ strokeWidth: 2 }}
      />
      <ReferenceLine
        y={totalEstDemand}
        label={{
          value: "Est. demand",
          fill: "black",
          position: "insideBottomRight",
        }}
        stroke={"black"}
        strokeDasharray="3 3"
        strokeWidth={0.8}
        isFront={true}
      />
    </ScatterChart>
  );
}

export default BandwidthAggregationPlot;
