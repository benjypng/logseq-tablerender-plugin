import { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import reactStringReplace from "react-string-replace";

export const checkCell = (
  graphName: string,
  content: string,
): ReactNode | string => {
  let str: ReactNode[] | string = content;
  //  Check for block
  if (content.includes("id:: ")) {
    const uuid = content.substring(content.indexOf("id:: ") + 4).trim();
    const contentText = content.substring(0, content.indexOf("id:: "));
    str = reactStringReplace(contentText, contentText, (match) => (
      <a href={`logseq://graph/${graphName}?block-id=${uuid}`}>{match}</a>
    ));
  }

  // Check for page
  const rxPageRef = /(\[\[(.*?)\]\])/g;
  const matchedArray = [...content.matchAll(rxPageRef)];

  if (matchedArray.length > 0) {
    for (const m of matchedArray) {
      const elem = (
        <a href={`logseq://graph/${graphName}?page=${m[2]}`}>{m[2]}</a>
      );
      str = reactStringReplace(str, m[1], () => elem);
    }
  }

  return str;
};
