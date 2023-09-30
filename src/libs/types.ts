import { ColumnDef } from "@tanstack/react-table";

export type DataProps = { [key: string]: string | undefined }[];

export type ColumnProps = ColumnDef<{ [key: string]: any }>[];

export type MathProps = {
  sumCol: string;
  data: DataProps;
};

export type ParamsProps = {
  sumCol?: string | number;
  averageCol?: string | number;
  medianCol?: string | number;
  modeCol?: string | number;
  varianceCol?: string | number;
  sdCol?: string | number;
  ssdCol?: string | number;
  percentileCol?: string | number;
};
