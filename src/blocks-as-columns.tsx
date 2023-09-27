import { BlockEntity, BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { createColumnHelper } from "@tanstack/react-table";
import { checkCell } from "./helpers/handle-cell-type";

export const blocksAsColumns = async (
  blockData: BlockEntity[],
  graphName: string,
) => {
  // Column Headers Start
  const columnHelper = createColumnHelper<any>();
  let colArr = [];
  for (let i = 0; i < blockData.length; i++) {
    const payload = columnHelper.accessor(`col${i + 1}`, {
      header: blockData[i]?.content,
      cell: (info) => {
        return checkCell(graphName, info.getValue());
      },
    });
    colArr.push(payload);
  }
  // Column Headers End

  // Data Row Start
  let rowArr = [];
  for (let i = 0; i < blockData[0].children.length; i++) {
    let payload: { [key: string]: string } = {};

    for (let j = 0; j < blockData.length; j++) {
      let content = blockData[j].children[i].content;
      const rxBlockRef = /\(\(([^)]*)\)\)/;
      const blockRef = rxBlockRef.exec(content);

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
