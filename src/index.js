import '@logseq/libs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

const main = async () => {
  console.log('Table Render plugin loaded');

  // Generate unique identifier
  const uniqueIdentifier = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');

  // Insert renderer upon slash command
  logseq.Editor.registerSlashCommand('table render', async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :tables_${uniqueIdentifier()}}}`
    );
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get uuid of payload so that child blocks can be retrieved for the board
    const uuid = payload.uuid;
    const [type] = payload.arguments;
    const id = type.split('_')[1]?.trim();
    const tableId = `tables_${id}`;

    if (!type.startsWith(':tables_')) return;

    logseq.provideStyle(`
    .tableHeader {
      border-bottom: solid 3px red;
      background: aliceblue;
      color: black !important;
      font-weight: bold;
    }

    .tableRow {
      padding: 10px;
      border: solid 1px gray;
      background: papayawhip;
      color: black;
    }

    .plainHeader {
      padding: 10px;
      border: 1px solid black;
      background: white; 
      color: black !important;
      font-size: 100%;
    }

    .plainRow {
      padding: 10px;
      border: 1px solid black;
      background: white; 
      color: black !important;
      font-size: 100%;
    }

    .calculationRow {
      padding: 10px;
      border: solid 1px gray;
      background: pink;
      color: black; 
      font-weight: bold;
    }
    `);

    const renderBlock = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });

    if (renderBlock.children[0] && renderBlock.children[0].children) {
      const data = renderBlock.children[0].children;
      const summary = renderBlock.children[0];
      // Use React to render board
      const board = ReactDOMServer.renderToStaticMarkup(
        <App blockData={data} summary={summary.content} />
      );

      // Set div for renderer to use
      const cmBoard = (board) => {
        return `<div id="${tableId}" data-slot-id="${slot}" data-table-id="${tableId}" data-block-uuid="${uuid}">${board}</div>`;
      };

      logseq.provideUI({
        key: `${tableId}`,
        slot,
        reset: true,
        template: cmBoard(board),
      });
    }
  });
};

logseq.ready(main).catch(console.error);
