import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./handle-cell-type";

export const blocksAsRows = async (
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
  for (let i = 0; i < blockData.length; i++) {
    const payload = columnHelper.accessor(`col${i + 1}`, {
      header: blockData[i]?.content,
      cell: (info) => {
        return checkCell(path, graphName, info.getValue());
      },
    });
    colArr.push(payload);
  }
  // Column Headers End

  // Data Row Start
  let rowArr = [];
  for (let i = 0; i < blockData[0]!.children?.length!; i++) {
    let payload: { [key: string]: string } = {};

    for (let j = 0; j < blockData.length; j++) {
      if (!blockData[j]?.children![i]) break;
      let content = (blockData[j]?.children![i]! as BlockEntity).content;
      const blockRef = /\(\(([^)]*)\)\)/.exec(content);
      // get block here because you can't have a promise in columnHelper
      if (blockRef) {
        content = (await logseq.Editor.getBlock(blockRef[1] as BlockUUID))!
          .content;
      }
      payload[`col${j + 1}`] =
        i < blockData[j]!.children!.length ? content : "";
    }
    rowArr.push(payload);
  }
  // Data Row End

  return { colArr, rowArr };
};
