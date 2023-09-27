import "@logseq/libs";
import { renderToStaticMarkup } from "react-dom/server";
import { Table } from "./components/Table";
import { blocksAsColumns } from "./blocks-as-columns";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

const main = async () => {
  console.log("Table Render plugin loaded");

  // Insert renderer upon slash command
  logseq.Editor.registerSlashCommand("Render table", async (e) => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :tables_${e.uuid}}}`);
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const { uuid } = payload;
    const [type] = payload.arguments;
    if (!type) return;
    const tableId = `tables_${uuid}_${slot}`;
    if (!type.startsWith(":tables_")) return;

    // Get graph name
    const { name, path } = (await logseq.App.getCurrentGraph())!;

    // Get block data to render
    const blk = await logseq.Editor.getBlock(uuid, { includeChildren: true });
    if (!blk || !blk.children) return;
    const { rowArr: data, colArr: columns } = await blocksAsColumns(
      blk.children as BlockEntity[],
      name,
      path,
    );

    if (!data || !columns) return;
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
