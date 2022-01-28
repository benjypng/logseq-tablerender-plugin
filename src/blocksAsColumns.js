import React from 'react';

export const blocksAsColumns = (blockData) => {
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
  if (blockData.length > 0) {
    for (let i = 0; i < blockData[0].children.length; i++) {
      let payload = {};
      for (let j = 0; j < blockData.length; j++) {
        payload[`col${j + 1}`] = i < blockData[j].children.length ? blockData[j].children[i].content : '';
      }
      rowArr.push(payload);
    }
  }

  const data = React.useMemo(() => rowArr, []);
  // Data Row End

  return { columns, data };
};
