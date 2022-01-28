import React from 'react';
import { useTable } from 'react-table';
import { blocksAsColumns } from './blocksAsColumns';
// import { childBlocksAsColumns } from './childBlocksAsColumns';

const App = (props) => {
  const { blockData, summary } = props;

  let columns;
  let data;

  if (!summary.includes('rows')) {
    columns = blocksAsColumns(blockData).columns;
    data = blocksAsColumns(blockData).data;
  }
  // else if (summary.includes('rows')) {
  // insert alternatives for columns and data here.
  // columns = childBlocksAsColumns(blockData).columns;
  // data = childBlocksAsColumns(blockData).data;
  // }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const sum = () => {
    if (summary.includes('nosum')) {
      return;
    } else {
      const reducer = (previousValue, currentValue) =>
        previousValue + currentValue;

      const median = (arr) => {
        let middle = Math.floor(arr.length / 2);
        arr = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0
          ? arr[middle]
          : (arr[middle - 1] + arr[middle]) / 2;
      };

      let sumArr = [];
      let medianArr = [];

      for (let i = 1; i < blockData.length; i++) {
        const childrenArr = blockData[i].children.map((c) =>
          parseFloat(c.content)
        );
        sumArr.push(childrenArr.reduce(reducer));
        medianArr.push(median(childrenArr));
      }

      const averageArr = sumArr.map((v) =>
        (v / blockData[0].children.length).toFixed(2)
      );

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
    }
  };

  return (
    <React.Fragment>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className={
                    summary.includes('nostyle') ? 'plainHeader' : 'tableHeader'
                  }
                >
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
                    <td
                      {...cell.getCellProps()}
                      className={
                        summary.includes('nostyle') ? 'plainRow' : 'tableRow'
                      }
                    >
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
};

export default App;
