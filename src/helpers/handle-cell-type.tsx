import showdown from 'showdown'

import { removeLsAttributes } from '../libs/process-content/remove-ls-attributes'

const converter = new showdown.Converter()

export const checkCell = async (
  _path: string,
  graphName: string,
  content: string,
) => {
  let str = removeLsAttributes(content)
  str = converter.makeHtml(str)

  if (str.startsWith('<p>https://')) {
    str = str.replaceAll('<p>', '').replaceAll('</p>', '')
    str = `<a href="${str}" target="_blank">${str}</a>`
  }

  const rxPageRef = /\[\[(.*?)\]\]/g
  const matchedPageRef = rxPageRef.exec(str)
  if (matchedPageRef) {
    str = str.replace(
      matchedPageRef[0],
      `<a href="logseq://graph/${graphName}?page=${matchedPageRef[1]}">${matchedPageRef[1]}</a>`,
    )
  }

  const rxBlockRef = /\(\((.*?)\)\)/g
  const matchedBlockRef = rxBlockRef.exec(str)
  if (matchedBlockRef) {
    const block = await logseq.Editor.getBlock(matchedBlockRef[1] as string)
    const content =
      block!.content.indexOf('id:: ') !== -1
        ? block!.content.substring(0, block!.content.indexOf('id:: '))
        : block!.content
    str = str.replace(
      matchedBlockRef[0],
      `<a href="logseq://graph/${graphName}?block-id=${matchedBlockRef[1]}">${content}</a>`,
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: str }} />
}
