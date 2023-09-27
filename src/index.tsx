import "@logseq/libs";
import { renderToStaticMarkup } from "react-dom/server";
import { Table } from "./components/Table";
import { blocksAsColumns } from "./blocksAsColumns";
//import { childBlocksAsColumns } from "./childBlocksAsColumns";

const main = async () => {
  console.log("Table Render plugin loaded");

  // Insert renderer upon slash command
  logseq.Editor.registerSlashCommand("Render table", async (e) => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :tables_${e.uuid}}}`);
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get uuid of payload so that child blocks can be retrieved for the board
    const { uuid } = payload;
    const [type] = payload.arguments;
    if (!type) return;
    const tableId = `tables_${uuid}_${slot}`;
    if (!type.startsWith(":tables_")) return;

    const blk = await logseq.Editor.getBlock(uuid, { includeChildren: true });

    const { rowArr: data, colArr: columns } = await blocksAsColumns(
      blk?.children,
    );

    const html = renderToStaticMarkup(<Table data={data} columns={columns} />);

    logseq.provideUI({
      key: `${tableId}`,
      slot,
      reset: true,
      template: html,
    });
  });
};

logseq.ready(main).catch(console.error);
