import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./handle-cell-type";

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) {
    return [];
  }
  const result = blockData.map((b: BlockEntity) => b.content);
  return result;
};

export const blocksAsColumns = async (
  blockData: BlockEntity[],
  graphName: string,
  path: string,
): Promise<{
  rowArr: { [key: string]: string }[];
  colArr: { header?: any | undefined; cell?: any | undefined }[];
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
  for (const [i] of blockData[0]?.children?.entries()!) {
    let payload: { [key: string]: string } = {};
    for (const [j, value] of blockData.entries()) {
      let content = (value.children![i]! as BlockEntity).content;
      const blockRef = /\(\(([^)]*)\)\)/.exec(content);
      // get block here because you can't have a promise in columnHelper
      if (blockRef) {
        content = (await logseq.Editor.getBlock(blockRef[1] as BlockUUID))!
          .content;
      }
      payload[`col${j + 1}`] = i < value.children!.length ? content : "";
    }
    rowArr.push(payload);
  }
  // Data Row End
  //[col1: test col2: row 2 col 1]

  return { colArr, rowArr };
};
