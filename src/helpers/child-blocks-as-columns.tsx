import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin";
import { createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./handle-cell-type";

const getFirstChildren = (blockData: BlockEntity) => {
  if (blockData.length == 0) {
    return [];
  }
  let trace = blockData;
  let result = [trace.content];
  while (trace.children!.length > 0) {
    trace = trace.children![0] as BlockEntity;
    result.push(trace.content);
  }
  return result;
};

export const childBlocksAsColumns = async (
  blockData: BlockEntity[],
  graphName: string,
  path: string,
): Promise<{
  rowArr: { [key: string]: string }[];
  colArr: { header?: any | undefined; cell?: any | undefined }[];
}> => {
  // Column Headers Start
  // When children are treated as rows, column headers come from the trace of first children of the tree.
  const columnHelper = createColumnHelper<any>();
  let colArr = [];
  if (blockData.length > 0 && blockData[0]) {
    for (const [i, value] of getFirstChildren(blockData[0]).entries()) {
      const payload = columnHelper.accessor(`col${i + 1}`, {
        header: value,
        cell: (info) => {
          return checkCell(path, graphName, info.getValue());
        },
      });
      colArr.push(payload);
    }
  }
  // Column Headers End

  // Data Row Start
  // Rows are traces of the subsequent children of the blockData tree.
  let rowArr = [];
  for (let i = 1; i < blockData.length; i++) {
    let payload: { [key: string]: string } = {};
    for (let [j, value] of getFirstChildren(
      blockData[i] as BlockEntity,
    ).entries()) {
      if (!value) continue;
      const blockRef = /\(\(([^)]*)\)\)/.exec(value);
      // get block here because you can't have a promise in columnHelper
      if (blockRef) {
        value = (await logseq.Editor.getBlock(blockRef[1] as BlockUUID))!
          .content;
      }
      payload[`col${j + 1}`] = value;
    }
    rowArr.push(payload);
  }
  // Data Row End

  return { colArr, rowArr };
};
