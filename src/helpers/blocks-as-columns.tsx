import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./handle-cell-type";

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

  let arr = [];
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
  rowArr: { [key: string]: string | undefined }[];
  colArr: ColumnDef<{ [key: string]: string | undefined }, any>[];
}> => {
  // Column Headers Start
  const columnHelper = createColumnHelper<any>();
  let colArr = [];
  for (const [i, value] of getFirstChildren(blockData).entries()) {
    const payload = columnHelper.accessor(`col${i + 1}`, {
      header: value,
      cell: (info) => {
        return checkCell(path, graphName, info.getValue());
      },
    });
    colArr.push(payload);
  }
  // Column Headers End

  // Data Row Start
  let rowArr = [];
  for (const [_i, cols] of getData(blockData).entries()) {
    let payload: { [key: string]: string | undefined } = {};
    for (let [j, value] of cols.entries()) {
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
