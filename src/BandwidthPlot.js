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
import { bandwidthCutoff, fairShareCutoff, fairShareColor } from "./globals";
import { bandwidthFunctionDataPoints } from "./fairShareLogic";

function BandwidthPlot({ flowGroup, allocLevels }) {
  let data = bandwidthFunctionDataPoints(flowGroup, allocLevels);
  data = data.map(([fs, bw]) => {
    return { fs: fs === Infinity ? fairShareCutoff : fs, bw: bw };
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
        domain={[0, fairShareCutoff]}
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
        domain={[0, bandwidthCutoff]}
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
