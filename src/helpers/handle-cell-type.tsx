import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export const checkCell = (
  path: string,
  graphName: string,
  content: string,
): ReactNode | string => {
  if (!content) return;
  let str: ReactNode[] | string = content;

  //  Check for block
  const uuid = /id\:\:(.*)/.exec(content);
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
  const rxImgRef = /!\[(.*?)\}/g;
  const matchedImgRefArray = [...content.matchAll(rxImgRef)];

  if (matchedImgRefArray.length > 0) {
    for (const i of matchedImgRefArray) {
      const filename = /\(\.\.\/assets\/(.*?)\)/.exec(i[1]!)![1];
      const height = /:height(.*?)(\d+)/.exec(i[0])![2];
      const width = /:width(.*?)(\d+)/.exec(i[0])![2];
      const elem = (
        <img
          src={`assets://${path}/assets/${filename}`}
          height={height}
          width={width}
        />
      );
      str = reactStringReplace(str, i[0], () => elem);
    }
  }

  // Check for block link e.g. []()
  const rxBlockLinkRef = /(\[(.*?)\])(\((.*?)\))/g;
  const matchedBlockLinkRefArray = [...content.matchAll(rxBlockLinkRef)];

  if (matchedBlockLinkRefArray.length > 0) {
    for (const i of matchedBlockLinkRefArray) {
      const name = i[2];
      const link = i[4];
      const elem = (
        <a href={link} target="_blank" className="external-link">
          {name}
        </a>
      );
      str = reactStringReplace(str, i[0], () => elem);
    }
  }

  //Check for link
  const rxLinkRef =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const matchedLinkArr = [...content.matchAll(rxLinkRef)];

  if (matchedLinkArr.length > 0) {
    for (const l of matchedLinkArr) {
      const elem = (
        <a href={l[0]} target="_blank" className="external-link">
          {l[0]}
        </a>
      );
      str = reactStringReplace(str, l[0], () => elem);
    }
  }

  return str;
};
