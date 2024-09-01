import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'
import { ReactElement } from 'react'

import { removeLsAttributes } from '../libs/process-content/remove-ls-attributes'
import { checkCell } from './handle-cell-type'

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0 || !blockData[0]) {
    return []
  }
  const result = []
  result.push(blockData[0].content)
  for (const b of blockData[0].children as BlockEntity[]) {
    result.push(b.content)
  }
  return result
}

export const blocksAsRows = async (
  blockData: BlockEntity[],
  graphName: string,
  path: string,
) => {
  // Column Headers Start
  const colArr = []
  for (const [i, value] of getFirstChildren(blockData).entries()) {
    const col = `col${i + 1}`
    const payload = {
      accessorKey: col,
      header: removeLsAttributes(value),
      cell: ({ getValue }: { getValue: () => HTMLDivElement }) => getValue(),
    }
    colArr.push(payload)
  }
  // Column Headers End

  // Data Row Start
  const rowArr = []
  for (let i = 1; i < blockData.length!; i++) {
    const payload: Record<string, ReactElement> = {}
    payload[`col1`] = <p>{blockData[i]!.content}</p>

    for (const [j, value] of blockData[i]!.children!.entries()) {
      if (!value) continue
      payload[`col${j + 2}`] = await checkCell(
        path,
        graphName,
        (value as BlockEntity).content,
      )
    }
    rowArr.push(payload)
  }
  // Data Row End
  return { colArr, rowArr }
}
