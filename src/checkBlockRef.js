export const checkBlockRef = async (content) => {
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
      block.content.substring(0, block.content.indexOf('id::'))
    );
  }

  return content;
};
