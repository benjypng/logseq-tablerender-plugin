import '@logseq/libs'

import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'
import { renderToStaticMarkup } from 'react-dom/server'

import { Summary } from './components/Summary'
import { Table } from './components/Table'
import { blocksAsColumns } from './helpers/blocks-as-columns'
import { blocksAsRows } from './helpers/blocks-as-rows'
import { childBlocksAsColumns } from './helpers/child-blocks-as-columns'
import { checkParams } from './libs/check-params'
import { doMath } from './libs/do-math'

const main = async () => {
  console.log('Table Render plugin loaded')

  // Insert renderer upon slash command
  logseq.Editor.registerSlashCommand('Render table', async (e) => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :tables_${e.uuid}}}`)
  })

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const { uuid } = payload
    const [type] = payload.arguments
    if (!type) return
    const tableId = `tables_${uuid}_${slot}`
    if (!type.startsWith(':tables_')) return

    // Get graph name
    const { name, path } = (await logseq.App.getCurrentGraph())!

    // Get block data to render
    const blk = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    })
    if (!blk || !blk.children || blk.children.length === 0) return

    const paramsBlk = blk?.children![0]
    const { content, children } = paramsBlk as BlockEntity
    if (children?.length === 0) return

    let data
    let columns
    switch (true) {
      case content.includes('rows'): {
        const { rowArr: dataVar, colArr: columnsVar } =
          await childBlocksAsColumns(children as BlockEntity[], name, path)
        data = dataVar
        columns = columnsVar
        break
      }
      case content.includes('cols'): {
        const { rowArr: dataVar, colArr: columnsVar } = await blocksAsRows(
          children as BlockEntity[],
          name,
          path,
        )
        data = dataVar
        columns = columnsVar
        break
      }
      case content.includes('data'): {
        const { rowArr: dataVar, colArr: columnsVar } = await blocksAsColumns(
          children as BlockEntity[],
          name,
          path,
        )
        data = dataVar
        columns = columnsVar
        break
      }
      default:
    }

    if (!data || !columns) return

    const summaryResults = doMath(checkParams(content), data, columns)

    let html
    if (summaryResults) {
      html = renderToStaticMarkup(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Table data={data} columns={columns} />
          <Summary results={summaryResults} />
        </div>,
      )
    } else {
      html = renderToStaticMarkup(<Table data={data} columns={columns} />)
      if (!html) return
    }

    logseq.provideUI({
      key: `${tableId}`,
      slot,
      reset: true,
      template: html,
    })
  })
}

logseq.ready(main).catch(console.error)
