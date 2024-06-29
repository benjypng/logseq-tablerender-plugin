import { ColumnDef } from "@tanstack/react-table";
import {
  CalculationTypes,
  DataProps,
  MathResults,
  MathTypeProps,
  ParamsProps,
} from "./types";
import {
  getAverage,
  getMedian,
  getMode,
  getPercentile,
  getSD,
  getSampleSD,
  getSum,
  getVariance,
} from "../helpers/math-helpers";

export const doMath = (
  params: ParamsProps[],
  data: DataProps,
  columns: ColumnDef<{ [key: string]: string | undefined }, any>[],
): MathResults[] => {
  const getSummaryObj = (
    param: ParamsProps,
    mathType: MathTypeProps,
  ): MathResults => {
    const paramValues = Object.values(param);
    const type = paramValues[0] as CalculationTypes;
    const colNum = paramValues[1] as string;

    let value;
    switch (mathType) {
      case "percentileCol":
        value = getPercentile(colNum, data, parseFloat(paramValues[2] ?? "0"));
        break;
      case "sumCol":
        value = getSum(colNum, data);
        break;
      case "averageCol":
        value = getAverage(colNum, data);
        break;
      case "medianCol":
        value = getMedian(colNum, data);
        break;
      case "modeCol":
        value = getMode(colNum, data);
        break;
      case "varianceCol":
        value = getVariance(colNum, data);
        break;
      case "sdCol":
        value = getSD(colNum, data);
        break;
      case "ssdCol":
        value = getSampleSD(colNum, data);
        break;
      default:
        value = 0;
    }

    const description = columns.filter(
      (c: any) => c.accessorKey === `col${colNum}`,
    );

    return {
      description: (description[0]?.header as string) ?? "Error",
      type,
      value,
    };
  };

  const results = params.map((param) => {
    const mathType = Object.keys(param)[1] as MathTypeProps;
    return getSummaryObj(param, mathType);
  });

  return results;
};
