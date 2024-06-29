import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";

import { ColumnProps,DataProps } from "~/libs/types";

import { checkCell } from "./handle-cell-type";

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) {
    return [];
  }
  const result = [];
  result.push(blockData[0]?.content);
  for (const b of blockData[0]?.children as BlockEntity[]) {
    result.push(b.content);
  }
  return result;
};

export const blocksAsRows = async (
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
  for (let i = 1; i < blockData.length!; i++) {
    const payload: Record<string, string> = {};
    payload[`col1`] = blockData[i]!.content;
    for (const [j, value] of blockData[i]!.children!.entries()) {
      if (!value) continue;
      const blockRef = /\(\(([^)]*)\)\)/.exec((value as BlockEntity).content);
      // get block here because you can't have a promise in columnHelper
      if (blockRef) {
        const content = (await logseq.Editor.getBlock(
          blockRef[1] as BlockUUID,
        ))!.content;
        payload[`col${j + 2}`] = content;
      } else {
        payload[`col${j + 2}`] = (value as BlockEntity).content;
      }
    }
    rowArr.push(payload);
  }
  // Data Row End
  return { colArr, rowArr };
};
