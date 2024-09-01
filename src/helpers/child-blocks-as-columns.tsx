import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { ReactElement } from 'react'

import { removeLsAttributes } from '../libs/process-content/remove-ls-attributes'
import { checkCell } from './handle-cell-type'

const getFirstChildren = (blockData: BlockEntity) => {
  if (blockData.length == 0) {
    return []
  }
  let trace = blockData
  const result = [trace.content]
  while (trace.children!.length > 0) {
    trace = trace.children![0] as BlockEntity
    result.push(trace.content)
  }
  return result
}

export const childBlocksAsColumns = async (
  blockData: BlockEntity[],
  graphName: string,
  path: string,
) => {
  // Column Headers Start
  // When children are treated as rows, column headers come from the trace of first children of the tree.
  const colArr = []
  if (blockData.length > 0 && blockData[0]) {
    for (const [i, value] of getFirstChildren(blockData[0]).entries()) {
      const col = `col${i + 1}`
      const payload = {
        accessorKey: col,
        header: removeLsAttributes(value),
        cell: ({ getValue }: { getValue: () => HTMLDivElement }) => getValue(),
      }
      colArr.push(payload)
    }
  }
  // Column Headers End

  // Data Row Start
  const rowArr = []
  for (let i = 1; i < blockData.length; i++) {
    const payload: Record<string, ReactElement> = {}
    for (const [j, value] of getFirstChildren(
      blockData[i] as BlockEntity,
    ).entries()) {
      if (!value) continue
      payload[`col${j + 1}`] = await checkCell(path, graphName, value)
    }
    rowArr.push(payload)
  }
  // Data Row End

  return { colArr, rowArr }
}
