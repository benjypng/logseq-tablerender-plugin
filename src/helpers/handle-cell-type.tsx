import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";
import { handleBold } from "../libs/process-content/handle-bold";
import { handleImage } from "../libs/process-content/handle-image";
import { handleItalics } from "../libs/process-content/handle-italics";
import { handleLink } from "../libs/process-content/handle-link";
import { handleTag } from "../libs/process-content/handle-tag";

export const checkCell = (
  path: string,
  graphName: string,
  content: string,
): ReactNode | string => {
  if (!content) return;
  let str: ReactNode[] | string = content;

  //  Check for block
  const uuid = /id::(.*)/.exec(content);
  if (uuid) {
    const contentText = content.substring(0, content.indexOf("id:: "));
    str = reactStringReplace(contentText, contentText, (match) => (
      <a href={`logseq://graph/${graphName}?block-id=${uuid[1]?.trim()}`}>
        {match}
      </a>
    ));
  }

  // Check for page
  const rxPageRef = /(\[\[(.*?)\]\])/g;
  const matchedPageRefArray = [...content.matchAll(rxPageRef)];

  if (matchedPageRefArray.length > 0) {
    for (const m of matchedPageRefArray) {
      const elem = (
        <a href={`logseq://graph/${graphName}?page=${m[2]}`}>{m[2]}</a>
      );
      str = reactStringReplace(str, m[1], () => elem);
    }
  }

  // Check for image
  str = handleImage(str, path);

  // Check for link
  str = handleLink(str);

  // Check for tag
  str = handleTag(str, graphName);

  // Check for bold
  str = handleBold(str);

  // Check for italics
  str = handleItalics(str);

  return str;
};
