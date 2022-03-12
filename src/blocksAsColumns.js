import { checkBlockRef } from "./checkBlockRef";

export const blocksAsColumns = async (blockData) => {
    // Column Headers Start
    let colArr = [];
    for (let i = 0; i < blockData.length; i++) {
        let payload = {
            Header: await checkBlockRef(blockData[i].content),
            accessor: `col${i + 1}`,
        };
        colArr.push(payload);
    }
    // Column Headers End

    // Data Row Start
    let rowArr = [];
    if (blockData.length > 0) {
        for (let i = 0; i < blockData[0].children.length; i++) {
            let payload = {};
            for (let j = 0; j < blockData.length; j++) {
                payload[`col${j + 1}`] =
                    i < blockData[j].children.length
                        ? await checkBlockRef(blockData[j].children[i].content)
                        : "";
            }
            rowArr.push(payload);
        }
    }

    // Data Row End

    return { colArr, rowArr };
};
