import React, { useState } from 'react';
import { useTable } from 'react-table';

function App(props) {
  const { blockData } = props;
  const [sumArr, setSumArr] = useState([]);

  console.log(blockData);

  // Column Headers Start
  let colArr = [];
  for (let i = 0; i < blockData.length; i++) {
    let payload = {
      Header: blockData[i].content,
      accessor: `col${i + 1}`,
    };
    colArr.push(payload);
  }

  const columns = React.useMemo(() => colArr, []);
  // Column Headers End

  // Data Row Start
  let rowArr = [];
  // Array 0 will have data for column 1
  // Array 1 will have data for column 2
  // Array 2 will have data for column 3
  for (let i = 0; i < blockData[0].children.length; i++) {
    let payload = {};
    for (let j = 0; j < blockData.length; j++) {
      payload[`col${j + 1}`] = blockData[j].children[i].content;
    }
    rowArr.push(payload);
  }

  const data = React.useMemo(() => rowArr, []);
  // Data Row End

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const sum = () => {
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;

    const median = (arr) => {
      let middle = Math.floor(arr.length / 2);
      arr = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0
        ? arr[middle]
        : (arr[middle - 1] + arr[middle]) / 2;
    };

    // arr = [sum of column 2, sum of column 3, and so on]
    let sumArr = [];
    let medianArr = [];

    for (let i = 1; i < blockData.length; i++) {
      const childrenArr = blockData[i].children.map((c) => parseInt(c.content));
      sumArr.push(childrenArr.reduce(reducer));
      medianArr.push(median(childrenArr));
    }

    const averageArr = sumArr.map((v) => (v / blockData.length).toFixed(2));

    return (
      <React.Fragment>
        <tr>
          <td className="calculationRow">Sum</td>
          {sumArr.map((a) => (
            <td className="calculationRow">{a}</td>
          ))}
        </tr>
        <tr>
          <td className="calculationRow">Average</td>
          {averageArr.map((a) => (
            <td className="calculationRow">{a}</td>
          ))}
        </tr>
        <tr>
          <td className="calculationRow">Median</td>
          {medianArr.map((a) => (
            <td className="calculationRow">{a}</td>
          ))}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="tableHeader">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="tableRow">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {sum()}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default App;
