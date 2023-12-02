import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { checkCell } from "./handle-cell-type";
import { DataProps, ColumnProps } from "~/libs/types";

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) return [];
  const result = blockData.map((b: BlockEntity) => b.content);
  return result;
};

const getData = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) return [];

  // Get length of longest children
  const childrenBlocksLength = blockData.map((b) => b.children);
  const longestArrLength = Math.max(
    0,
    ...childrenBlocksLength.map((s) => s!.length),
  );

  const arr = [];
  for (let i = 0; i < longestArrLength; i++) {
    const mappedVal = blockData.map((b) => {
      if (!b.children) return;
      if (b.children[i]) {
        return (b.children[i] as BlockEntity).content;
      }
    });
    arr.push(mappedVal);
  }
  return arr;
};

export const blocksAsColumns = async (
  blockData: BlockEntity[],
  graphName: string,
  path: string,
): Promise<{
  rowArr: DataProps;
  colArr: ColumnProps;
}> => {
  // Column Headers Start
  const colArr = [];
  for (const [i, value] of getFirstChildren(blockData).entries()) {
    const col = `col${i + 1}`;
    const payload = {
      accessorKey: col,
      header: value,
      cell: (info: any) => {
        return checkCell(path, graphName, info.getValue());
      },
    };
    colArr.push(payload);
  }
  // Column Headers End

  // Data Row Start
  const rowArr = [];
  for (const [_i, cols] of getData(blockData).entries()) {
    const payload: { [key: string]: string | undefined } = {};
    for (const [j, value] of cols.entries()) {
      let cellValue;
      if (!value) continue;
      const blockRef = /\(\(([^)]*)\)\)/.exec(value);
      // get block here because you can't have a promise in columnHelper
      if (blockRef) {
        cellValue = (await logseq.Editor.getBlock(blockRef[1] as BlockUUID))!
          .content;
      }
      payload[`col${j + 1}`] = cellValue;
    }
    rowArr.push(payload);
  }
  // Data Row End

  return { colArr, rowArr };
};
