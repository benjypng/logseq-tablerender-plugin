import React from "react";

export const checkBlockRefAndImg = async (content) => {
  const rxBlockRef = /\(\(([^)]*)\)\)/;
  const blockId = rxBlockRef.exec(content);

  if (!blockId) {
    content = content;
  } else {
    const block = await logseq.Editor.getBlock(blockId[1], {
      includeChildren: true,
    });

    content = content.replace(
      `((${blockId[1]}))`,
      block.content.substring(0, block.content.indexOf("id::"))
    );
  }

  if (content.startsWith("![")) {
    // Get url of image
    const rxBlockRef = /\(([^)]*)\)/;
    const imgRef = rxBlockRef.exec(content);

    content = (
      <React.Fragment>
        <img src={imgRef[1]} />
      </React.Fragment>
    );
  }

  // remove id:: if block in table is referenced
  content = content.includes("\nid::")
    ? content.substring(0, content.indexOf("\nid::"))
    : content;

  return content;
};
