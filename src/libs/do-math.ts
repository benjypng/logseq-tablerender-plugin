import { ColumnDef } from "@tanstack/react-table";
import { ColumnProps, DataProps, ParamsProps } from "./types";
import stats from "stats-lite";

export const doMath = (
  params: ParamsProps,
  data: DataProps,
  columns: ColumnDef<{ [key: string]: string | undefined }, any>[],
) => {
  let results: any = {};
  for (const p of Object.keys(params)) {
    const col = params[p as keyof ParamsProps];
    if (!col) return;
    const description = columns.filter(
      (c: any) => c.accessorKey === `col${col}`,
    );
    if (!description) return;

    let newVal;
    switch (p) {
      case "sumCol":
        newVal = getSum(col as string, data);
        results["sum"] = {
          description: description[0]?.header,
          value: newVal,
        };
        break;
      case "averageCol":
        newVal = getAverage(col as string, data);
        results["average"] = {
          description: description[0]?.header,
          value: newVal,
        };
        break;
      case "medianCol":
        newVal = getMedian(col as string, data);
        results["median"] = {
          description: description[0]?.header,
          value: newVal,
        };
        break;
      case "modeCol":
        newVal = getMode(col as string, data);
        results["mode"] = {
          description: description[0]?.header,
          value: newVal,
        };
        break;
      default:
        break;
    }
  }
  return results;
};

const getSum = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.sum(valuesToSum);
};

const getAverage = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.mean(valuesToSum);
};

const getMedian = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.median(valuesToSum);
};

const getMode = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.mode(valuesToSum);
};
