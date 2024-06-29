import {
  ColumnDef,
  ColumnDefTemplate,
  HeaderContext,
} from "@tanstack/react-table";

export type DataProps = { [key: string]: string | undefined }[];

export type ColumnProps = ColumnDef<{ [key: string]: any }>[];

export type MathProps = {
  sumCol: string;
  data: DataProps;
};

export type MathTypeProps =
  | "sumCol"
  | "averageCol"
  | "medianCol"
  | "modeCol"
  | "varianceCol"
  | "sdCol"
  | "ssdCol"
  | "percentileCol";

export type CalculationTypes =
  | "sum"
  | "average"
  | "median"
  | "mode"
  | "variance"
  | "sd"
  | "ssd"
  | "percentile";

type MathTypeMapping = {
  [key in MathTypeProps]?: string;
};

export type ParamsProps = {
  type: CalculationTypes;
} & MathTypeMapping;

export type MathResults = {
  description: string;
  type: CalculationTypes;
  value: number;
};
