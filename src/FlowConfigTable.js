import React from "react";
import styled from "styled-components";
import { useTable } from "react-table";

//doc: https://react-table.tanstack.com/docs/examples/grouping

const Styles = styled.div`
  padding: 0;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.2rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align: center;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const makeData = (flowGroup, allocLevels) => {
  const res = [];
  for (let i = 0; i < allocLevels.length; i++) {
    for (let j = 0; j < flowGroup.allocLevels[i].length; j++) {
      const bw = flowGroup.allocLevels[i][j][0];
      res.push({
        allocLevel: j === 0 ? allocLevels[i].name : "",
        bandwidth: bw === Infinity ? "\u221E" : bw,
        weight: flowGroup.allocLevels[i][j][1],
        subRows: undefined,
      });
    }
  }
  return res;
};

function FlowConfigTable({ flowGroup, allocLevels }) {
  const columns = React.useMemo(
    () => [
      {
        Header: `${flowGroup.name} (${flowGroup.estimatedDemand} est. demand)`,
        columns: [
          {
            Header: "Allocation Level",
            accessor: "allocLevel",
          },
          {
            Header: "Weight",
            accessor: "weight",
          },
          {
            Header: "Bandwidth",
            accessor: "bandwidth",
          },
        ],
      },
    ],
    [flowGroup]
  );

  const data = React.useMemo(() => makeData(flowGroup, allocLevels), [
    flowGroup,
    allocLevels,
  ]);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default FlowConfigTable;
