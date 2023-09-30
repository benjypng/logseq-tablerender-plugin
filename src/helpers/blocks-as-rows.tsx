import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./handle-cell-type";

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) {
    return [];
  }
  let result = [];
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
  rowArr: { [key: string]: string }[];
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
  for (let i = 1; i < blockData.length!; i++) {
    let payload: { [key: string]: string } = {};
    payload[`col1`] = blockData[i]?.content!;
    for (let [j, value] of blockData[i]?.children?.entries()!) {
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
