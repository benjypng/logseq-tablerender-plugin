import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const blocksAsColumns = async (blockData: BlockEntity) => {
  // Column Headers Start
  let colArr = [];
  for (let i = 0; i < blockData.length; i++) {
    let payload = {
      header: blockData[i].content,
      cell: (info) => {
        if (info.getValue().startsWith("[[")) {
          return (
            <a href={`logseq://graph/testing-plugins?page=${info.getValue()}`}>
              {info.getValue()}
            </a>
          );
        } else {
          return info.getValue();
        }
      },
      accessorKey: `col${i + 1}`,
    };
    colArr.push(payload);
  }
  // Column Headers End

  // Data Row Start
  let rowArr = [];
  if (blockData.length > 0) {
    for (let i = 0; i < blockData[0].children.length; i++) {
      let payload = {};
      for (let j = 0; j < blockData.length; j++) {
        let content = blockData[j].children[i].content;
        const uuid = blockData[j].children[i].uuid;

        //@ts-ignore
        payload[`col${j + 1}`] =
          i < blockData[j].children.length ? content : "";
      }
      rowArr.push(payload);
    }
  }

  // Data Row End
  return { colArr, rowArr };
};
