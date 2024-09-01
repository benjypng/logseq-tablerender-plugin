import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'
import { ReactElement } from 'react'

import { removeLsAttributes } from '../libs/process-content/remove-ls-attributes'
import { checkCell } from './handle-cell-type'

const getFirstChildren = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) return []
  const result = blockData.map((b: BlockEntity) => b.content)
  return result
}

const getData = (blockData: BlockEntity[]) => {
  if (blockData.length === 0) return []

  // Get length of longest children
  const childrenBlocksLength = blockData.map((b) => b.children)
  const longestArrLength = Math.max(
    0,
    ...childrenBlocksLength.map((s) => s!.length),
  )

  const arr = []
  for (let i = 0; i < longestArrLength; i++) {
    const mappedVal = blockData.map((b) => {
      if (!b.children) return
      if (b.children[i]) {
        return (b.children[i] as BlockEntity).content
      }
    })
    arr.push(mappedVal)
  }
  return arr
}

export const blocksAsColumns = async (
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
  for (const [_i, cols] of getData(blockData).entries()) {
    const payload: Record<string, ReactElement> = {}
    for (const [j, value] of cols.entries()) {
      if (!value) continue
      payload[`col${j + 1}`] = await checkCell(path, graphName, value)
    }
    rowArr.push(payload)
  }
  // Data Row End

  return { colArr, rowArr }
}
