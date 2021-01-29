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

const makeData = (allocLevels) => {
  const res = [];
  for (let i = 0; i < allocLevels.length; i++) {
    const prevFs = i === 0 ? 0 : allocLevels[i - 1].maxFairShare;
    const fs = allocLevels[i].maxFairShare;
    res.push({
      allocLevel: allocLevels[i].name,
      fairShare: `${prevFs}-${fs === Infinity ? "\u221E" : fs}`,
      subRows: undefined,
    });
  }
  return res;
};

function AllocationLevelTable({ allocLevels }) {
  const columns = React.useMemo(
    () => [
      {
        Header: `Allocation levels`,
        columns: [
          {
            Header: "",
            accessor: "allocLevel",
          },
          {
            Header: "Fair Share",
            accessor: "fairShare",
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(allocLevels), [allocLevels]);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default AllocationLevelTable;
