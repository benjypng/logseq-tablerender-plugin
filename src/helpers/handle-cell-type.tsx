import { ReactNode, createElement } from "react";
import reactStringReplace from "react-string-replace";

export const checkCell = (
  graphName: string,
  content: string,
): ReactNode | string => {
  let str: ReactNode | string = content;
  // Check for page
  const rxPageRef = /\[\[([^)]*)\]\]/;
  const pageName = rxPageRef.exec(content);
  if (pageName) {
    const elem = (
      <a href={`logseq://graph/${graphName}?page=${pageName[1]}`}>
        {pageName[1]}
      </a>
    );

    str = reactStringReplace(content, pageName[0], () => elem);
  }

  return str;

  //  const rxBlockRef = /\(\(([^)]*)\)\)/;
  //  const blockRef = rxBlockRef.exec(content);
  //  if (blockRef) {
  //    const blockContent = (await logseq.Editor.getBlock(blockRef[1])).content;
  //    return (
  //      <a href={`logseq://graph/${graphName}?block-id=${blockRef[1]}`}>
  //        {blockContent}
  //      </a>
  //    );
  //  }
  // Check for block
};
