import { useImmer } from "use-immer";
import "./App.css";
import FlowGroupList from "./FlowGroupList";
import LinkAllocationPlot from "./LinkAllocationPlot";
import AllocationLevelTable from "./AllocationLevelTable";
import {
  allocationLevelsFromPaper,
  flowGroup1FromPaper,
  flowGroup2FromPaper,
} from "./paperExamples";
// eslint-disable-next-line
import { allTests } from "./tests";

function App() {
  // eslint-disable-next-line
  const [allocLevels, updateAllocLevels] = useImmer(
    allocationLevelsFromPaper()
  );
  // eslint-disable-next-line
  const [flowGroups, updateFlowGroups] = useImmer([
    flowGroup1FromPaper(),
    flowGroup2FromPaper(),
  ]);

  // allTests();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "auto auto",
        columnGap: "20px",
        justifyItems: "start", //horizontal
        alignItems: "center", //vertical
        justifyContent: "start",
        marginLeft: "15px",
        marginTop: "15px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "auto",
          rowGap: "15px",
          justifyItems: "center", //horizontal
          alignItems: "center", //vertical
          justifyContent: "center",
        }}
      >
        <AllocationLevelTable allocLevels={allocLevels} />
        <FlowGroupList flowGroups={flowGroups} allocLevels={allocLevels} />
      </div>
      <LinkAllocationPlot flowGroups={flowGroups} allocLevels={allocLevels} />
    </div>
  );
}

export default App;
