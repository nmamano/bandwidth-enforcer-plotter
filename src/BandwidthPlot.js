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
import { bandwidthFunctionDataPoints } from "./fairShareLogic";

function BandwidthPlot({ flowGroup, allocLevels }) {
  const pts = bandwidthFunctionDataPoints(flowGroup, allocLevels); //points [fs, bw]
  const plotMaxFs = pts.reduce(
    (accum, [fs, bw]) => (fs === Infinity ? accum : Math.max(accum, fs + 1)),
    plotBaseMaxFairShare
  );
  const data = pts.map(([fs, bw], idx) => {
    const prevBw = idx === 0 ? 0 : pts[idx - 1][1];
    console.assert(fs !== Infinity || bw === prevBw, bw, prevBw);
    return fs === Infinity ? { fs: plotMaxFs, bw: prevBw } : { fs: fs, bw: bw };
  });

  //documentation: http://recharts.org/en-US/examples/JointLineScatterChart
  return (
    <ScatterChart
      width={420}
      height={230}
      name={`${flowGroup.name} bandwidth function`}
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
        domain={[0, plotBaseMaxFairShare]}
        name="Fair Share"
        label={{ value: "Fair Share", position: "insideBottom" }}
        height={40}
        tickCount={11}
      />
      <YAxis
        type="number"
        dataKey="bw"
        name="Bandwidth"
        label={{
          value: "Allocated Bandwidth",
          position: "insideLeft",
          style: { textAnchor: "middle" },
          angle: -90,
        }}
        width={40}
        domain={[0, plotBwCutoff]}
        tickCount={6}
      />
      <Tooltip />
      {/* <Legend /> */}
      <Scatter
        name="Fair Share"
        data={data}
        fill={flowGroup.color}
        line={{ strokeWidth: 2.5 }}
      />
      <ReferenceLine
        y={flowGroup.estimatedDemand}
        label={{
          value: "Est. demand",
          fill: flowGroup.color,
          position: "insideBottomRight",
        }}
        stroke={flowGroup.color}
        strokeDasharray="3 3"
        strokeWidth={0.8}
        isFront={true}
      />
    </ScatterChart>
  );
}

export default BandwidthPlot;
