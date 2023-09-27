export const checkCell = (
  graphName: string,
  str: string,
): JSX.Element | string => {
  // Check for page
  const rxPageRef = /\[\[([^)]*)\]\]/;
  const pageName = rxPageRef.exec(str);

  const rxBlockRef = /\(\(([^)]*)\)\)/;
  const blockRef = rxBlockRef.exec(str);

  if (pageName) {
    return (
      <a href={`logseq://graph/${graphName}?page=${pageName[1]}`}>
        {pageName[1]}
      </a>
    );
  } else if (blockRef) {
    return (
      <a href={`logseq://graph/${graphName}?block-id=${blockRef[1]}`}>
        {blockRef[1]}
      </a>
    );
  } else {
    return str;
  }

  // Check for block
};
